'use client'

import { useSession, signOut, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Kraftey
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/remove-background" className="text-gray-600 hover:text-blue-600 transition-colors">
              Remove Background
            </Link>
            <Link href="/image-upscaler" className="text-gray-600 hover:text-blue-600 transition-colors">
              Image Upscaler
            </Link>
            <Link href="/watermark-remover" className="text-gray-600 hover:text-blue-600 transition-colors">
              Watermark Remover
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">FREE</span>
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {/* Subscription Badge */}
                <div className="hidden sm:flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    (session.user as any)?.subscriptionPlan === 'pro' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {(session.user as any)?.subscriptionPlan?.toUpperCase() || 'FREE'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {session.user?.name}
                  </span>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-sm text-gray-500 hover:text-gray-700 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/signin"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation & User Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/remove-background" className="text-gray-600 hover:text-blue-600">
                Remove Background
              </Link>
              <Link href="/image-upscaler" className="text-gray-600 hover:text-blue-600">
                Image Upscaler
              </Link>
              <Link href="/watermark-remover" className="text-gray-600 hover:text-blue-600 flex items-center">
                Watermark Remover
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">FREE</span>
              </Link>
              {session && (
                <>
                  <hr className="my-2" />
                  <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-gray-600 hover:text-blue-600"
                  >
                    Sign Out
                  </button>
                </>
              )}
              <Link href="/blog" className="text-gray-600 hover:text-blue-600">
                Blog
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
                Pricing
              </Link>
              {!session && (
                <>
                  <hr className="my-2" />
                  <Link href="/auth/signin" className="text-gray-600 hover:text-blue-600">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Desktop User Dropdown */}
        {session && isMenuOpen && (
          <div className="hidden md:block absolute top-16 right-4 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
            <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Dashboard
            </Link>
            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile Settings
            </Link>
            <Link href="/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Upgrade Plan
            </Link>
            <hr className="my-1" />
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
