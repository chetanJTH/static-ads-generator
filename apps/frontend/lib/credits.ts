/**
 * Credit and Token Management System
 * 
 * This module handles all credit/token operations including:
 * - Checking available credits/tokens
 * - Deducting credits on feature usage
 * - Managing free tier limits
 * - Resetting monthly free allowances
 */

import { prisma } from './prisma'

export type FeatureType = 'background_removal' | 'image_upscale' | 'watermark_removal' | 'image_editing'

export interface CreditCheckResult {
  canUse: boolean
  creditType: 'free' | 'specific' | 'general' | 'subscription'
  remainingCredits?: number
  message?: string
}

export interface CreditDeductionResult {
  success: boolean
  creditType: 'free' | 'specific' | 'general' | 'subscription'
  remainingCredits: number
  message?: string
}

/**
 * Check if user can use a specific feature
 * Priority order: Free tier → Specific credits → General tokens → Subscription
 */
export async function checkFeatureAvailability(
  userId: string, 
  feature: FeatureType
): Promise<CreditCheckResult> {
  try {
    // Get user's subscription and credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        userCredits: true
      }
    })

    if (!user) {
      return { canUse: false, creditType: 'free', message: 'User not found' }
    }

    // Check if user has active subscription (unlimited usage)
    if (user.subscription?.status === 'active' && 
        ['pro', 'enterprise'].includes(user.subscription.plan)) {
      return { 
        canUse: true, 
        creditType: 'subscription',
        message: 'Unlimited usage with subscription'
      }
    }

    // Initialize credits if they don't exist
    let userCredits = user.userCredits
    if (!userCredits) {
      userCredits = await prisma.userCredits.create({
        data: { userId }
      })
    }

    // Reset free tier credits if it's a new month
    await resetMonthlyFreeCredits(userId, userCredits)

    // Check free tier availability first
    const freeCreditsAvailable = await checkFreeCredits(userCredits, feature)
    if (freeCreditsAvailable.canUse) {
      return freeCreditsAvailable
    }

    // Check specific credits
    const specificCreditsAvailable = await checkSpecificCredits(userCredits, feature)
    if (specificCreditsAvailable.canUse) {
      return specificCreditsAvailable
    }

    // Check general tokens
    const generalTokensAvailable = await checkGeneralTokens(userCredits)
    if (generalTokensAvailable.canUse) {
      return generalTokensAvailable
    }

    return { 
      canUse: false, 
      creditType: 'free',
      message: 'No credits available. Purchase credits or upgrade to continue.' 
    }

  } catch (error) {
    console.error('Error checking feature availability:', error)
    return { 
      canUse: false, 
      creditType: 'free',
      message: 'Error checking credits. Please try again.' 
    }
  }
}

/**
 * Deduct credits for feature usage
 */
export async function deductCredits(
  userId: string,
  feature: FeatureType,
  creditsToDeduct: number = 1
): Promise<CreditDeductionResult> {
  try {
    const availability = await checkFeatureAvailability(userId, feature)
    
    if (!availability.canUse) {
      return {
        success: false,
        creditType: 'free',
        remainingCredits: 0,
        message: availability.message
      }
    }

    const userCredits = await prisma.userCredits.findUnique({
      where: { userId }
    })

    if (!userCredits) {
      return {
        success: false,
        creditType: 'free',
        remainingCredits: 0,
        message: 'Credits not found'
      }
    }

    // Deduct based on credit type
    switch (availability.creditType) {
      case 'free':
        return await deductFreeCredits(userId, userCredits, feature, creditsToDeduct)
      
      case 'specific':
        return await deductSpecificCredits(userId, userCredits, feature, creditsToDeduct)
      
      case 'general':
        return await deductGeneralTokens(userId, userCredits, creditsToDeduct)
      
      case 'subscription':
        // For subscription users, just log usage without deducting
        await logFeatureUsage(userId, feature, creditsToDeduct, 'subscription', false)
        return {
          success: true,
          creditType: 'subscription',
          remainingCredits: -1, // Unlimited
          message: 'Used with subscription'
        }
      
      default:
        return {
          success: false,
          creditType: 'free',
          remainingCredits: 0,
          message: 'Unknown credit type'
        }
    }

  } catch (error) {
    console.error('Error deducting credits:', error)
    return {
      success: false,
      creditType: 'free',
      remainingCredits: 0,
      message: 'Error processing credits'
    }
  }
}

/**
 * Add credits to user account (for purchases)
 */
export async function addCredits(
  userId: string,
  creditsToAdd: {
    backgroundRemovalCredits?: number
    imageUpscaleCredits?: number
    watermarkRemovalCredits?: number
    imageEditingCredits?: number
    generalTokens?: number
  }
): Promise<void> {
  await prisma.userCredits.upsert({
    where: { userId },
    update: {
      backgroundRemovalCredits: {
        increment: creditsToAdd.backgroundRemovalCredits || 0
      },
      imageUpscaleCredits: {
        increment: creditsToAdd.imageUpscaleCredits || 0
      },
      watermarkRemovalCredits: {
        increment: creditsToAdd.watermarkRemovalCredits || 0
      },
      imageEditingCredits: {
        increment: creditsToAdd.imageEditingCredits || 0
      },
      generalTokens: {
        increment: creditsToAdd.generalTokens || 0
      }
    },
    create: {
      userId,
      backgroundRemovalCredits: creditsToAdd.backgroundRemovalCredits || 0,
      imageUpscaleCredits: creditsToAdd.imageUpscaleCredits || 0,
      watermarkRemovalCredits: creditsToAdd.watermarkRemovalCredits || 0,
      imageEditingCredits: creditsToAdd.imageEditingCredits || 0,
      generalTokens: creditsToAdd.generalTokens || 0
    }
  })
}

// Helper functions

async function checkFreeCredits(userCredits: any, feature: FeatureType): Promise<CreditCheckResult> {
  // GROWTH PHASE: All features are unlimited and free
  // This will be changed later when implementing paid tiers
  
  return {
    canUse: true,
    creditType: 'free',
    remainingCredits: 999999, // Unlimited for growth phase
    message: 'Free unlimited usage during growth phase!'
  }
}

async function checkSpecificCredits(userCredits: any, feature: FeatureType): Promise<CreditCheckResult> {
  const specificCreditsMap = {
    'background_removal': userCredits.backgroundRemovalCredits,
    'image_upscale': userCredits.imageUpscaleCredits,
    'watermark_removal': userCredits.watermarkRemovalCredits,
    'image_editing': userCredits.imageEditingCredits
  }

  const available = specificCreditsMap[feature] || 0
  
  return {
    canUse: available > 0,
    creditType: 'specific',
    remainingCredits: available,
    message: available > 0 ? `${available} specific credits available` : 'No specific credits available'
  }
}

async function checkGeneralTokens(userCredits: any): Promise<CreditCheckResult> {
  const available = userCredits.generalTokens || 0
  
  return {
    canUse: available > 0,
    creditType: 'general',
    remainingCredits: available,
    message: available > 0 ? `${available} general tokens available` : 'No general tokens available'
  }
}

async function resetMonthlyFreeCredits(userId: string, userCredits: any): Promise<void> {
  const now = new Date()
  const lastReset = new Date(userCredits.lastFreeResetDate)
  
  // Check if it's a new month
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    await prisma.userCredits.update({
      where: { userId },
      data: {
        freeBackgroundRemovals: 5, // Reset to default
        freeImageUpscales: 3, // Reset to default
        lastFreeResetDate: now
      }
    })
  }
}

async function deductFreeCredits(
  userId: string, 
  userCredits: any, 
  feature: FeatureType, 
  amount: number
): Promise<CreditDeductionResult> {
  const updateMap = {
    'background_removal': { freeBackgroundRemovals: { decrement: amount } },
    'image_upscale': { freeImageUpscales: { decrement: amount } }
  }

  const updateData = updateMap[feature as keyof typeof updateMap]
  if (!updateData) {
    return {
      success: false,
      creditType: 'free',
      remainingCredits: 0,
      message: 'Feature not available in free tier'
    }
  }

  const updated = await prisma.userCredits.update({
    where: { userId },
    data: updateData
  })

  await logFeatureUsage(userId, feature, amount, 'free', true)

  const remaining = feature === 'background_removal' 
    ? updated.freeBackgroundRemovals 
    : updated.freeImageUpscales

  return {
    success: true,
    creditType: 'free',
    remainingCredits: remaining,
    message: `${remaining} free uses remaining`
  }
}

async function deductSpecificCredits(
  userId: string, 
  userCredits: any, 
  feature: FeatureType, 
  amount: number
): Promise<CreditDeductionResult> {
  const updateMap = {
    'background_removal': { backgroundRemovalCredits: { decrement: amount } },
    'image_upscale': { imageUpscaleCredits: { decrement: amount } },
    'watermark_removal': { watermarkRemovalCredits: { decrement: amount } },
    'image_editing': { imageEditingCredits: { decrement: amount } }
  }

  const updated = await prisma.userCredits.update({
    where: { userId },
    data: updateMap[feature]
  })

  await logFeatureUsage(userId, feature, amount, 'specific', false)

  const remainingMap = {
    'background_removal': updated.backgroundRemovalCredits,
    'image_upscale': updated.imageUpscaleCredits,
    'watermark_removal': updated.watermarkRemovalCredits,
    'image_editing': updated.imageEditingCredits
  }

  return {
    success: true,
    creditType: 'specific',
    remainingCredits: remainingMap[feature],
    message: `${remainingMap[feature]} specific credits remaining`
  }
}

async function deductGeneralTokens(
  userId: string, 
  userCredits: any, 
  amount: number
): Promise<CreditDeductionResult> {
  const updated = await prisma.userCredits.update({
    where: { userId },
    data: {
      generalTokens: { decrement: amount }
    }
  })

  await logFeatureUsage(userId, 'background_removal', amount, 'general', false) // Log with any feature

  return {
    success: true,
    creditType: 'general',
    remainingCredits: updated.generalTokens,
    message: `${updated.generalTokens} general tokens remaining`
  }
}

async function logFeatureUsage(
  userId: string,
  feature: FeatureType,
  creditsUsed: number,
  creditType: string,
  wasFreeTier: boolean
): Promise<void> {
  await prisma.featureUsage.create({
    data: {
      userId,
      feature,
      creditsUsed,
      creditType,
      wasFreeTier,
      success: true
    }
  })
}
