import BlogPostPage from './BlogPostPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Optimize Images for Better SEO Rankings | Kraftey Blog',
  description: 'Learn how to optimize images for better SEO rankings. Complete guide covering image compression, alt text, file naming, and technical SEO strategies for improved search visibility.',
  keywords: 'image SEO, optimize images, SEO rankings, image optimization, alt text, image compression, search engine optimization',
  openGraph: {
    title: 'How to Optimize Images for Better SEO Rankings',
    description: 'Learn how to optimize images for better SEO rankings. Complete guide covering image compression, alt text, file naming, and technical SEO strategies.',
    type: 'article',
    publishedTime: '2025-09-16T07:50:11.401Z',
    authors: ['Kraftey Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Optimize Images for Better SEO Rankings',
    description: 'Learn how to optimize images for better SEO rankings. Complete guide covering image compression, alt text, file naming, and technical SEO strategies.',
  }
}

export default function Page() {
  return <BlogPostPage />
}