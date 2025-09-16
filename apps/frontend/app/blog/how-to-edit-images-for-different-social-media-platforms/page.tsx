import BlogPostPage from './BlogPostPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Edit Images for Different Social Media Platforms | Kraftey Blog',
  description: '
Introduction

Understanding how to edit images for different social media platforms is crucial for modern content creators and businesses looking to stay competitive in today's digital landscape.

Key Concepts

This comprehensive guide covers everything you need to know about implementing effective strategies and best practices.',
  keywords: 'AI tools, background removal, photography, content creation, kraftey',
  openGraph: {
    title: 'How to Edit Images for Different Social Media Platforms',
    description: '
Introduction

Understanding how to edit images for different social media platforms is crucial for modern content creators and businesses looking to stay competitive in today's digital landscape.

Key Concepts

This comprehensive guide covers everything you need to know about implementing effective strategies and best practices.',
    type: 'article',
    publishedTime: '2025-09-16T07:49:30.180Z',
    authors: ['Kraftey Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Edit Images for Different Social Media Platforms',
    description: '
Introduction

Understanding how to edit images for different social media platforms is crucial for modern content creators and businesses looking to stay competitive in today's digital landscape.

Key Concepts

This comprehensive guide covers everything you need to know about implementing effective strategies and best practices.',
  }
}

export default function Page() {
  return <BlogPostPage />
}