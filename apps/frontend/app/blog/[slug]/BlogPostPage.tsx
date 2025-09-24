'use client'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  featured_image?: string
  status: string
  published_at: string
  created_at: string
  updated_at: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  view_count: number
  internal_links: any[]
}

interface BlogPostPageProps {
  post: BlogPost
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  // Track page view
  useEffect(() => {
    // The view count is already incremented by the backend API
    // This is just for any additional client-side tracking if needed
  }, [])

  // Convert markdown-style content to JSX
  const convertContentToJSX = (content: string) => {
    return content
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/^/, '<p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/$/, '</p>')
      .replace(/<p class="mb-4 text-gray-700 leading-relaxed"><h/g, '<h')
      .replace(/<\/h([123])><\/p>/g, '</h$1>')
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image || "https://kraftey.com/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kraftey",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kraftey.com/logo.png"
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kraftey.com/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.tags.join(', '),
    "wordCount": post.content.split(' ').length,
    "url": `https://kraftey.com/blog/${post.slug}`
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white">
        <Header />
        
        <article className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Article Header */}
            <header className="mb-12">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href="/blog" className="hover:text-blue-600">Blog</Link>
                <span className="mx-2">›</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-8 flex-wrap gap-4">
                <span>{new Date(post.published_at).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}</span>
                <span>•</span>
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                <span>•</span>
                <span>By {post.author}</span>
                <span>•</span>
                <span>{post.view_count} views</span>
              </div>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </header>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-12">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: convertContentToJSX(post.content) }}
            />

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{post.author}</h3>
                  <p className="text-gray-600">
                    Content creator at Kraftey, helping businesses create better visual content with AI tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Try Our AI Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href="/remove-background" 
                  className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mr-3">🖼️</div>
                  <div>
                    <div className="font-medium text-gray-900">Background Remover</div>
                    <div className="text-sm text-gray-600">Remove backgrounds instantly with AI</div>
                  </div>
                </Link>
                <Link 
                  href="/image-upscaler" 
                  className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mr-3">🔍</div>
                  <div>
                    <div className="font-medium text-gray-900">Image Upscaler</div>
                    <div className="text-sm text-gray-600">Enhance image quality with AI</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link 
                href="/blog"
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </article>
        
        <Footer />
      </div>
    </>
  )
}
