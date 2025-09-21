import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's usage statistics
    const usageStats = await prisma.usageStats.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!usageStats) {
      // If no usage stats exist, create default ones
      const newUsageStats = await prisma.usageStats.create({
        data: {
          userId: session.user.id,
          backgroundRemovalCount: 0,
          imageUpscaleCount: 0,
          imageEditingCount: 0,
          watermarkRemovalCount: 0,
          apiCallsCount: 0
        }
      })
      
      return NextResponse.json(newUsageStats, { status: 200 })
    }

    return NextResponse.json(usageStats, { status: 200 })

  } catch (error) {
    console.error('Usage stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

