import BlogPostPage from './BlogPostPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creating Transparent Images for Web Design | Kraftey Blog',
  description: 'Introduction - Artificial Intelligence is revolutionizing creating transparent images for web design, making professional-quality results accessible to everyone. Whether you\'re a small business owner or content creator, AI tools level the playing field.',
  keywords: 'AI tools, background removal, ai tools, content creation, kraftey',
  openGraph: {
    title: 'Creating Transparent Images for Web Design',
    description: 'Introduction - Artificial Intelligence is revolutionizing creating transparent images for web design, making professional-quality results accessible to everyone. Whether you\'re a small business owner or content creator, AI tools level the playing field.',
    type: 'article',
    publishedTime: '2025-09-22T09:17:45.274Z',
    authors: ['Kraftey Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creating Transparent Images for Web Design',
    description: 'Introduction - Artificial Intelligence is revolutionizing creating transparent images for web design, making professional-quality results accessible to everyone. Whether you\'re a small business owner or content creator, AI tools level the playing field.',
  }
}

export default function Page() {
  return <BlogPostPage />
}