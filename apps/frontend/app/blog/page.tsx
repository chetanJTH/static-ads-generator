import { Metadata } from 'next'
import BlogPage from './BlogPage'

export const metadata: Metadata = {
  title: 'AI Content Creation Blog - Tips, Tutorials & Insights | Kraftey',
  description: 'Learn how to create better content with AI tools. Tips for background removal, image upscaling, and content marketing for creators and businesses.',
  keywords: 'AI content creation, background removal tips, image upscaling, image enhancement, content marketing, AI tools blog',
  openGraph: {
    title: 'AI Content Creation Blog - Tips, Tutorials & Insights',
    description: 'Learn how to create better content with AI tools. Tips and tutorials for creators.',
    type: 'website',
    url: 'https://kraftey.com/blog',
    siteName: 'Kraftey',
  },
  alternates: {
    canonical: 'https://kraftey.com/blog',
  },
  other: {
    'robots': 'index, follow',
  }
}

export default function Page() {
  return <BlogPage />
}

