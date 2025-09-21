'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface PremiumGateProps {
  children: ReactNode
  feature: string
  fallback?: ReactNode
}

export default function PremiumGate({ children, feature, fallback }: PremiumGateProps) {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-6">
            Please sign in to access {feature} and other premium features.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signin"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const userPlan = (session.user as any)?.subscriptionPlan || 'free'
  const isPremium = userPlan === 'pro' || userPlan === 'enterprise'

  // Free user accessing premium feature
  if (!isPremium) {
    return fallback || (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-6">
            {feature} is available for Pro and Enterprise users. Upgrade your plan to access this feature and more!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Upgrade to Pro
            </Link>
            <Link
              href="/"
              className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Free Tools
            </Link>
          </div>
          
          {/* Feature Preview */}
          <div className="mt-6 p-4 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-sm text-gray-500 mb-2">✨ What you'll get with Pro:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Advanced image editing tools</li>
              <li>• Watermark removal</li>
              <li>• Bulk processing</li>
              <li>• Priority support</li>
              <li>• Higher quality results</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Premium user - show the feature
  return <>{children}</>
}

// Hook for checking premium status
export function usePremium() {
  const { data: session } = useSession()
  const userPlan = (session?.user as any)?.subscriptionPlan || 'free'
  const isPremium = userPlan === 'pro' || userPlan === 'enterprise'
  
  return {
    isPremium,
    plan: userPlan,
    isLoggedIn: !!session
  }
}

