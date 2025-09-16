'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'

const values = [
  {
    title: 'Accessibility',
    description: 'AI tools should be free and accessible to everyone, not just big corporations.',
    icon: '🌍'
  },
  {
    title: 'Quality',
    description: 'We never compromise on the quality of our AI models and user experience.',
    icon: '⭐'
  },
  {
    title: 'Innovation',
    description: 'Constantly pushing the boundaries of what\'s possible with AI technology.',
    icon: '🚀'
  },
  {
    title: 'Privacy',
    description: 'Your images and data are processed securely and never stored permanently.',
    icon: '🔒'
  }
]

const stats = [
  {
    number: '10M+',
    label: 'Images Processed'
  },
  {
    number: '500K+',
    label: 'Happy Users'
  },
  {
    number: '150+',
    label: 'Countries Served'
  },
  {
    number: '99.9%',
    label: 'Uptime'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Democratizing AI for
              <span className="text-blue-600"> Content Creators</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              At Kraftey, we believe that powerful AI tools shouldn't be locked behind expensive 
              paywalls or complex interfaces. We're building the future of content creation, 
              one free tool at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Kraftey was born from a simple frustration: why were the best AI tools 
                  so expensive and complicated to use? As content creators ourselves, we 
                  experienced the pain of spending hours on tasks that should take minutes.
                </p>
                <p>
                  We started with background removal because it's such a common need. 
                  Whether you're an eCommerce seller photographing products, a social media 
                  manager creating posts, or a designer working on client projects, 
                  removing backgrounds is a daily task.
                </p>
                <p>
                  What began as a side project quickly grew into something bigger. Today, 
                  Kraftey processes millions of images every month, helping creators around 
                  the world save time and create better content.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">🎨</div>
              <p className="text-gray-600 italic">
                "Making AI accessible to everyone, everywhere"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kraftey by the Numbers
            </h2>
            <p className="text-xl text-gray-600">
              The impact we're making in the creator community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
              To democratize AI-powered content creation by building tools that are free, 
              fast, and accessible to creators everywhere. We believe that great content 
              shouldn't require expensive software or technical expertise.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl mb-3">🆓</div>
                <h3 className="text-lg font-semibold text-white mb-2">Free Forever</h3>
                <p className="text-blue-100">Core tools remain free with no usage limits</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-blue-100">Results in seconds, not minutes</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className="text-lg font-semibold text-white mb-2">Globally Accessible</h3>
                <p className="text-blue-100">Available worldwide, in any language</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What's Next?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're just getting started. Our roadmap includes exciting new AI tools 
              that will transform how you create content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Image Upscaler</h3>
              <p className="text-gray-600 mb-4">Enhance image quality and resolution with 4x AI upscaling technology</p>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Live</span>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-4">🎬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Video Generator</h3>
              <p className="text-gray-600 mb-4">Transform images into engaging video ads</p>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Development</span>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-4">✍️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Text Generator</h3>
              <p className="text-gray-600 mb-4">Generate compelling copy and headlines</p>
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Planned</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join the Kraftey Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be part of the movement to make AI accessible to all creators
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/remove-background"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Our Tools
            </Link>
            <Link
              href="/blog"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}





