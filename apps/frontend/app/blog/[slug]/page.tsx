import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostPage from './BlogPostPage'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

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

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/blog/posts/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Kraftey',
      description: 'The requested blog post could not be found.'
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt
  const keywords = post.meta_keywords || `${post.category.toLowerCase()}, AI tools, content creation, kraftey`

  return {
    title: `${title} | Kraftey Blog`,
    description,
    keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      tags: post.tags,
      url: `https://kraftey.com/blog/${post.slug}`,
      siteName: 'Kraftey',
      images: post.featured_image ? [
        {
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
    alternates: {
      canonical: `https://kraftey.com/blog/${post.slug}`,
    },
    other: {
      'article:published_time': post.published_at,
      'article:modified_time': post.updated_at,
      'article:author': post.author,
      'article:section': post.category,
      'article:tag': post.tags.join(', '),
    }
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  return <BlogPostPage post={post} />
}
