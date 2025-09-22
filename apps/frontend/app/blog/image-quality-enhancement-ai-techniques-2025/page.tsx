import { Metadata } from 'next'
import BlogPostPage from './BlogPostPage'

export const metadata: Metadata = {
  title: 'Image Quality Enhancement with AI: Advanced Techniques 2025 | Kraftey',
  description: 'Master image quality enhancement using AI. Learn about upscaling, noise reduction, sharpening, and color correction with modern AI tools.',
  keywords: 'image quality enhancement, AI image enhancement, photo quality improvement, image upscaling, noise reduction, photo restoration, AI photo editor',
  openGraph: {
    title: 'Image Quality Enhancement with AI: Advanced Techniques 2025',
    description: 'Complete guide to enhancing image quality using AI tools. Professional techniques for creators and photographers.',
    type: 'article',
    publishedTime: '2025-09-21',
    authors: ['Kraftey Team'],
  }
}

export default function Page() {
  return <BlogPostPage />
}


