import { Metadata } from 'next'
import PricingPage from './PricingPage'

export const metadata: Metadata = {
  title: 'Pricing - Free AI Tools for Content Creation | Kraftey',
  description: 'Kraftey offers free AI-powered tools for background removal, banner generation, and content creation. Compare our free and pro plans.',
  keywords: 'pricing, free AI tools, background removal pricing, banner generator pricing',
  openGraph: {
    title: 'Kraftey Pricing - Free AI Tools for Content Creation',
    description: 'Free AI-powered tools with optional pro features for advanced users.',
    type: 'website',
  }
}

export default function Page() {
  return <PricingPage />
}






