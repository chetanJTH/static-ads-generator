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
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
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
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/remove-background" className="text-gray-600 hover:text-blue-600">
                Remove Background
              </Link>
              <Link href="/image-upscaler" className="text-gray-600 hover:text-blue-600">
                Image Upscaler
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600">
                Blog
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
                Pricing
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
