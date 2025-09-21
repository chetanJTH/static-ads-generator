'use client'

import Link from 'next/link'

const tools = [
  {
    title: 'Remove Background',
    description: 'AI-powered background removal in seconds. Perfect for product photos, portraits, and social media.',
    icon: '🖼️',
    href: '/remove-background',
    status: 'Live',
    features: ['Instant processing', 'HD quality', 'Transparent PNG', 'Bulk processing']
  },
  {
    title: 'AI Image Upscaler',
    description: 'Enhance image quality and resolution with AI-powered upscaling technology. 4x resolution increase.',
    icon: '🔍',
    href: '/image-upscaler',
    status: 'Live',
    features: ['4x upscaling', 'AI enhancement', 'Professional quality', 'Fast processing']
  },
  {
    title: 'Watermark Remover',
    description: 'Remove watermarks from images using advanced AI technology. Clean, professional results.',
    icon: '🧹',
    href: '/watermark-remover',
    status: 'Live',
    features: ['AI-powered removal', 'High quality output', 'Multiple formats', 'Instant processing']
  },
  {
    title: 'AI Video Generator',
    description: 'Transform still images into engaging video ads for TikTok, Reels, and YouTube Shorts.',
    icon: '🎬',
    href: '/ai-video-generator',
    status: 'Coming Soon',
    features: ['Video from image', 'Multiple templates', 'Custom animations', 'Social formats']
  },
  {
    title: 'AI Text Generator',
    description: 'Generate compelling ad headlines, product descriptions, and marketing copy with AI.',
    icon: '✍️',
    href: '/ai-text-generator',
    status: 'Coming Soon',
    features: ['Ad headlines', 'Product descriptions', 'Social captions', 'SEO optimized']
  }
]

export default function ToolsGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Your Creative Tools in One Place
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From background removal to video creation, our AI-powered suite has everything you need to create professional content.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tool.status === 'Live' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {tool.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {tool.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {tool.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {tool.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link
                href={tool.href}
                className={`w-full inline-flex justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  tool.status === 'Live'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                {tool.status === 'Live' ? 'Try Now' : 'Coming Soon'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

