'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'

const sampleAds = [
  {
    title: "Instagram Post",
    size: "1080x1080",
    preview: "🎨"
  },
  {
    title: "Facebook Ad",
    size: "1200x628",
    preview: "📘"
  },
  {
    title: "LinkedIn Banner",
    size: "1584x396",
    preview: "💼"
  },
  {
    title: "Twitter Header",
    size: "1500x500",
    preview: "🐦"
  }
]

const useCases = [
  {
    title: "eCommerce Sellers",
    description: "Create product ads for Amazon, Shopify, and other marketplaces",
    icon: "🛒"
  },
  {
    title: "Social Media Managers",
    description: "Generate consistent branded content for all platforms",
    icon: "📱"
  },
  {
    title: "Small Business Owners",
    description: "Professional marketing materials without design skills",
    icon: "🏪"
  },
  {
    title: "Digital Marketers",
    description: "Scale ad creation for multiple campaigns and clients",
    icon: "📊"
  }
]

export default function AIBannerGeneratorPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
              🚧 Coming Soon
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Social Media Banner 
              <span className="text-purple-600"> Generator</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload your product photo, add a prompt, and generate stunning social media banners 
              automatically. Perfect for Instagram, Facebook, LinkedIn, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                disabled
                className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg text-lg font-medium cursor-not-allowed"
              >
                Coming Soon
              </button>
              <Link 
                href="/remove-background"
                className="border border-purple-600 text-purple-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Try Background Removal
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Multiple Formats
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Custom Prompts
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Brand Consistency
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Will Work
            </h2>
            <p className="text-xl text-gray-600">
              Simple 3-step process to create professional banners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Upload Product Photo</h3>
              <p className="text-gray-600">Upload your product image or any photo you want to use in your banner</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Add Your Prompt</h3>
              <p className="text-gray-600">Describe the style, colors, and message you want for your banner</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Generate & Download</h3>
              <p className="text-gray-600">AI creates your banner in multiple formats ready for social media</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Formats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Multiple Format Support
            </h2>
            <p className="text-xl text-gray-600">
              Generate banners optimized for every social platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sampleAds.map((ad, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="text-4xl mb-4">{ad.preview}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{ad.title}</h3>
                <p className="text-sm text-gray-600">{ad.size}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Every Creator
            </h2>
            <p className="text-xl text-gray-600">
              From eCommerce to agencies, streamline your banner creation process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Notified When We Launch
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Be the first to know when our AI Banner Generator goes live
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Notify Me
            </button>
          </div>
          
          <p className="text-sm text-purple-200 mt-4">
            No spam, just product updates and early access
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

