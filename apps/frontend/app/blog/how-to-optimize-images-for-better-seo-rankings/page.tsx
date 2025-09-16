import BlogPostPage from './BlogPostPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Optimize Images for Better SEO Rankings | Kraftey Blog',
  description: '
Introduction

Understanding how to optimize images for better seo rankings is crucial for modern content creators and businesses looking to stay competitive in today's digital landscape.

Key Concepts

This comprehensive guide covers everything you need to know about implementing effective strategies and best practices.',
  keywords: 'AI tools, background removal, design, content creation, kraftey',
  openGraph: {
    title: 'How to Optimize Images for Better SEO Rankings',
    description: '
Introduction

Understanding how to optimize images for better seo rankings is crucial for modern content creators and businesses looking to stay competitive in today's digital landscape.

Key Concepts

This comprehensive guide covers everything you need to know about implementing effective strategies and best practices.',
    type: 'article',
    publishedTime: '2025-09-16T07:50:11.401Z',
    authors: ['Kraftey Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Optimize Images for Better SEO Rankings',
    description: '
Introduction

Understanding how to optimize images for better seo rankings is crucial for modern content creators and businesses looking to stay competitive in today's digital landscape.

Key Concepts

This comprehensive guide covers everything you need to know about implementing effective strategies and best practices.',
  }
}

export default function Page() {
  return <BlogPostPage />
}