import { Metadata } from 'next'
import AboutPage from './AboutPage'

export const metadata: Metadata = {
  title: 'About Kraftey - AI Tools for Content Creators | Kraftey',
  description: 'Learn about Kraftey\'s mission to democratize AI-powered content creation tools. Our story, values, and commitment to helping creators succeed.',
  keywords: 'about kraftey, AI content creation, company story, mission, values',
  openGraph: {
    title: 'About Kraftey - AI Tools for Content Creators',
    description: 'Learn about our mission to democratize AI-powered content creation tools.',
    type: 'website',
  }
}

export default function Page() {
  return <AboutPage />
}





