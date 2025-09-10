import { Metadata } from 'next'
import BlogPostPage from './BlogPostPage'

export const metadata: Metadata = {
  title: 'Top 5 Free Online Tools to Remove Image Backgrounds (2025) | Kraftey Blog',
  description: 'Discover the best free tools for background removal in 2025. Compare AI-powered solutions, manual editing options, and find the perfect tool for your needs.',
  keywords: 'free background removal, remove background online, AI background remover, photo editing tools, transparent background',
  openGraph: {
    title: 'Top 5 Free Online Tools to Remove Image Backgrounds (2025)',
    description: 'Comprehensive guide to the best free background removal tools available in 2025.',
    type: 'article',
  }
}

export default function Page() {
  return <BlogPostPage />
}





