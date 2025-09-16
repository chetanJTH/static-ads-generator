import BlogPostPage from './BlogPostPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Edit Images for Different Social Media Platforms | Kraftey Blog',
  description: 'Learn how to edit images for different social media platforms. Complete guide covering optimal dimensions, formats, and editing techniques for Instagram, Facebook, Twitter, and more.',
  keywords: 'social media images, image editing, Instagram dimensions, Facebook images, Twitter images, social media marketing, image optimization',
  openGraph: {
    title: 'How to Edit Images for Different Social Media Platforms',
    description: 'Learn how to edit images for different social media platforms. Complete guide covering optimal dimensions, formats, and editing techniques.',
    type: 'article',
    publishedTime: '2025-09-16T07:49:30.180Z',
    authors: ['Kraftey Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Edit Images for Different Social Media Platforms',
    description: 'Learn how to edit images for different social media platforms. Complete guide covering optimal dimensions, formats, and editing techniques.',
  }
}

export default function Page() {
  return <BlogPostPage />
}