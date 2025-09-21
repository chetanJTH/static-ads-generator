import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { checkFeatureAvailability, FeatureType } from '@/lib/credits'
import { z } from 'zod'

const checkAvailabilitySchema = z.object({
  feature: z.enum(['background_removal', 'image_upscale', 'watermark_removal', 'image_editing'])
})

/**
 * Check if user can use a specific feature
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { feature } = checkAvailabilitySchema.parse(body)

    const result = await checkFeatureAvailability(session.user.id, feature as FeatureType)

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid feature type', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Feature availability check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

