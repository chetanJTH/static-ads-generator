import BlogPostPage from './BlogPostPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Creation Strategies for Small Businesses | Kraftey Blog',
  description: 'Introduction - In today\'s competitive eCommerce landscape, content creation strategies for small businesses can be the difference between a sale and a bounce. High-quality visuals directly impact your bottom line.',
  keywords: 'AI tools, background removal, ecommerce, content creation, kraftey',
  openGraph: {
    title: 'Content Creation Strategies for Small Businesses',
    description: 'Introduction - In today\'s competitive eCommerce landscape, content creation strategies for small businesses can be the difference between a sale and a bounce. High-quality visuals directly impact your bottom line.',
    type: 'article',
    publishedTime: '2025-09-22T09:26:23.243Z',
    authors: ['Kraftey Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content Creation Strategies for Small Businesses',
    description: 'Introduction - In today\'s competitive eCommerce landscape, content creation strategies for small businesses can be the difference between a sale and a bounce. High-quality visuals directly impact your bottom line.',
  }
}

export default function Page() {
  return <BlogPostPage />
}