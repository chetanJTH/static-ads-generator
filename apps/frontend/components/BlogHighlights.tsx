'use client'

import Link from 'next/link'

const blogPosts = [
  {
    title: 'Top 5 Free Online Tools to Remove Image Backgrounds (2025)',
    excerpt: 'Discover the best free tools for background removal, including AI-powered solutions and manual editing options.',
    category: 'Tools',
    readTime: '5 min read',
    href: '/blog/top-5-free-background-removal-tools-2025',
    image: '🛠️'
  },
  {
    title: 'How to Make High-Converting Ads with AI (Guide for eCommerce)',
    excerpt: 'Learn how to create compelling product ads using AI tools that drive sales and engagement.',
    category: 'Marketing',
    readTime: '8 min read',
    href: '/blog/high-converting-ads-with-ai-ecommerce-guide',
    image: '📈'
  },
  {
    title: 'Best AI Tools for Shopify & Amazon Sellers',
    excerpt: 'Essential AI tools every eCommerce seller needs to create professional product listings and marketing materials.',
    category: 'eCommerce',
    readTime: '6 min read',
    href: '/blog/best-ai-tools-shopify-amazon-sellers',
    image: '🛒'
  }
]

export default function BlogHighlights() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tips, tutorials, and insights to help you create better content with AI tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <article key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="text-4xl mb-4 text-center">{post.image}</div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link
                  href={post.href}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View All Articles
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

