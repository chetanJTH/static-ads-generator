import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { deductCredits, FeatureType } from '@/lib/credits'
import { z } from 'zod'

const useFeatureSchema = z.object({
  feature: z.enum(['background_removal', 'image_upscale', 'watermark_removal', 'image_editing']),
  creditsToUse: z.number().min(1).max(10).optional().default(1),
  metadata: z.object({
    inputUrl: z.string().optional(),
    outputUrl: z.string().optional(),
    processingTime: z.number().optional(),
    success: z.boolean().optional().default(true),
    errorMessage: z.string().optional()
  }).optional()
})

/**
 * Use a feature and deduct credits
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { feature, creditsToUse, metadata } = useFeatureSchema.parse(body)

    const result = await deductCredits(session.user.id, feature as FeatureType, creditsToUse)

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          message: result.message,
          canUse: false
        },
        { status: 402 } // Payment Required
      )
    }

    // Log additional metadata if provided
    if (metadata) {
      const { prisma } = require('@/lib/prisma')
      
      // Update the latest feature usage with additional metadata
      await prisma.featureUsage.updateMany({
        where: {
          userId: session.user.id,
          feature,
          createdAt: {
            gte: new Date(Date.now() - 5000) // Within last 5 seconds
          }
        },
        data: {
          inputUrl: metadata.inputUrl,
          outputUrl: metadata.outputUrl,
          processingTime: metadata.processingTime,
          success: metadata.success,
          errorMessage: metadata.errorMessage,
          metadata: JSON.stringify(metadata)
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      creditType: result.creditType,
      remainingCredits: result.remainingCredits,
      canUse: true
    }, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Feature usage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

