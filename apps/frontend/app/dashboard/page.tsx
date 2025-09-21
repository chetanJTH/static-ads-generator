'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PremiumGate from '../../components/PremiumGate'

interface UsageStats {
  backgroundRemovalCount: number
  imageUpscaleCount: number
  watermarkRemovalCount: number
  apiCallsCount: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session) {
      // Fetch real usage stats from API
      const fetchUsageStats = async () => {
        try {
          const response = await fetch('/api/user/usage-stats')
          if (response.ok) {
            const data = await response.json()
            setUsageStats(data)
          } else {
            console.error('Failed to fetch usage stats')
          }
        } catch (error) {
          console.error('Error fetching usage stats:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUsageStats()
    }
  }, [session])

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <PremiumGate feature="Dashboard">
            <div>This should not show</div>
          </PremiumGate>
        </div>
        <Footer />
      </div>
    )
  }

  const userPlan = (session.user as any)?.subscriptionPlan || 'free'
  const isPremium = userPlan === 'pro' || userPlan === 'enterprise'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session.user?.name}! Here's your account overview.
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{session.user?.name}</h2>
                <p className="text-gray-600">{session.user?.email}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    isPremium 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {userPlan.toUpperCase()} Plan
                  </span>
                  {!isPremium && (
                    <button className="ml-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Background Removals</h3>
                <p className="text-2xl font-bold text-gray-900">{usageStats?.backgroundRemovalCount}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Image Upscales</h3>
                <p className="text-2xl font-bold text-gray-900">{usageStats?.imageUpscaleCount}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Watermark Removals</h3>
                <p className="text-2xl font-bold text-gray-900">{usageStats?.watermarkRemovalCount}</p>
                <span className="text-xs text-green-600 font-medium">FREE</span>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">API Calls</h3>
                <p className="text-2xl font-bold text-gray-900">{usageStats?.apiCallsCount}</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/remove-background"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Remove Background</h3>
                <p className="text-sm text-gray-500">AI-powered background removal</p>
              </div>
            </a>

            <a
              href="/image-upscaler"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Upscale Image</h3>
                <p className="text-sm text-gray-500">Enhance image quality 4x</p>
              </div>
            </a>

            <a
              href="/watermark-remover"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Watermark Remover</h3>
                <p className="text-sm text-gray-500">Remove watermarks with AI</p>
                <span className="text-xs text-green-600 font-medium">FREE</span>
              </div>
            </a>
          </div>
        </div>

        {/* Upgrade CTA for Free Users */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Unlock Premium Features</h2>
                <p className="text-yellow-100">
                  Get access to advanced image editing, watermark removal, and more with Pro!
                </p>
              </div>
              <a
                href="/pricing"
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

