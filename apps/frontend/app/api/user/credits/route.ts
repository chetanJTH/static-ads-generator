import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

/**
 * Get user's current credit balance
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's credits and subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userCredits: true,
        subscription: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Initialize credits if they don't exist
    let userCredits = user.userCredits
    if (!userCredits) {
      userCredits = await prisma.userCredits.create({
        data: { userId: session.user.id }
      })
    }

    // Check if free credits need to be reset (new month)
    const now = new Date()
    const lastReset = new Date(userCredits.lastFreeResetDate)
    
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      userCredits = await prisma.userCredits.update({
        where: { userId: session.user.id },
        data: {
          freeBackgroundRemovals: 5,
          freeImageUpscales: 3,
          lastFreeResetDate: now
        }
      })
    }

    return NextResponse.json({
      // Free tier credits (reset monthly)
      freeCredits: {
        backgroundRemovals: userCredits.freeBackgroundRemovals,
        imageUpscales: userCredits.freeImageUpscales,
        lastResetDate: userCredits.lastFreeResetDate
      },
      // Paid credits
      paidCredits: {
        backgroundRemovalCredits: userCredits.backgroundRemovalCredits,
        imageUpscaleCredits: userCredits.imageUpscaleCredits,
        watermarkRemovalCredits: userCredits.watermarkRemovalCredits,
        imageEditingCredits: userCredits.imageEditingCredits,
        generalTokens: userCredits.generalTokens
      },
      // Subscription info
      subscription: {
        plan: user.subscription?.plan || 'free',
        status: user.subscription?.status || 'inactive',
        hasUnlimitedAccess: user.subscription?.status === 'active' && 
                           ['pro', 'enterprise'].includes(user.subscription?.plan || '')
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Credits fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

