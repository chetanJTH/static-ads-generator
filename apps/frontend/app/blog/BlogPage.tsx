'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const blogPosts = [
  {
    title: 'How to Optimize Images for Better SEO Rankings',
    excerpt: '
Introduction

Understanding how to optimize images for better seo rankings is crucial for modern content creators and businesses looking to stay competitive in today's digital landscape.

Key Concepts

This comprehensive guide covers everything you need to know about implementing effective strategies and best practices.',
    category: 'Design',
    readTime: '1 min read',
    href: '/blog/how-to-optimize-images-for-better-seo-rankings',
    image: '🎨',
    date: 'September 16, 2025'
  },
{
    title: 'How to Edit Images for Different Social Media Platforms',
    excerpt: '
Introduction

Understanding how to edit images for different social media platforms is crucial for modern content creators and businesses looking to stay competitive in today's digital landscape.

Key Concepts

This comprehensive guide covers everything you need to know about implementing effective strategies and best practices.',
    category: 'Photography',
    readTime: '1 min read',
    href: '/blog/how-to-edit-images-for-different-social-media-platforms',
    image: '📸',
    date: 'September 16, 2025'
  },
{
    title: 'Top 5 Free Online Tools to Remove Image Backgrounds (2025)',
    excerpt: 'Discover the best free tools for background removal, including AI-powered solutions and manual editing options. Learn which tools work best for different types of images and how to get professional results without spending money.',
    category: 'Tools',
    readTime: '5 min read',
    href: '/blog/top-5-free-background-removal-tools-2025',
    image: '🛠️',
    date: 'January 15, 2025'
  },
  {
    title: 'How to Make High-Converting Ads with AI (Guide for eCommerce)',
    excerpt: 'Learn how to create compelling product ads using AI tools that drive sales and engagement. This comprehensive guide covers everything from image optimization to copywriting with AI assistance.',
    category: 'Marketing',
    readTime: '8 min read',
    href: '/blog/high-converting-ads-with-ai-ecommerce-guide',
    image: '📈',
    date: 'January 12, 2025'
  },
  {
    title: 'Best AI Tools for Shopify & Amazon Sellers',
    excerpt: 'Essential AI tools every eCommerce seller needs to create professional product listings and marketing materials. Boost your sales with these powerful AI solutions.',
    category: 'eCommerce',
    readTime: '6 min read',
    href: '/blog/best-ai-tools-shopify-amazon-sellers',
    image: '🛒',
    date: 'January 10, 2025'
  },
  {
    title: 'Complete Guide to AI-Powered Background Removal',
    excerpt: 'Master the art of background removal using AI tools. Learn techniques, best practices, and how to achieve professional results for your product photography.',
    category: 'Tutorial',
    readTime: '10 min read',
    href: '/blog/ai-background-removal-guide',
    image: '🎨',
    date: 'January 8, 2025'
  },
  {
    title: 'Creating Professional Product Mockups with AI',
    excerpt: 'Transform your product photos into stunning mockups using AI technology. Perfect for eCommerce, marketing materials, and social media content.',
    category: 'Design',
    readTime: '7 min read',
    href: '/blog/ai-product-mockups-guide',
    image: '📱',
    date: 'January 5, 2025'
  },
  {
    title: 'AI Tools for Social Media Content Creation',
    excerpt: 'Discover how AI can streamline your social media content creation process. From image editing to caption generation, these tools will save you hours.',
    category: 'Social Media',
    readTime: '6 min read',
    href: '/blog/ai-social-media-content-tools',
    image: '📱',
    date: 'January 3, 2025'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Blog Header */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Content Creation Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tips, tutorials, and insights to help you create better content with AI tools. 
              Learn from experts and discover new ways to enhance your creative workflow.
            </p>
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="text-4xl mb-4 text-center">{post.image}</div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <Link
                      href={post.href}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      Read More
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get the latest AI content creation tips and tutorials delivered to your inbox. 
              No spam, just valuable insights to help you create better content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}



