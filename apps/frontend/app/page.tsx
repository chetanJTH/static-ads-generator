'use client'

import { useSession, signIn } from 'next-auth/react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ToolsGrid from '../components/ToolsGrid'
import BlogHighlights from '../components/BlogHighlights'
import Footer from '../components/Footer'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* AI Tools Grid */}
      <ToolsGrid />
      
      {/* Blog Highlights */}
      <BlogHighlights />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
