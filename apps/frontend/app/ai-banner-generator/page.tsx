import { Metadata } from 'next'
import AIBannerGeneratorPage from './AIBannerGeneratorPage'

export const metadata: Metadata = {
  title: 'AI Social Media Banner Generator - Create Ads Instantly | Kraftey',
  description: 'Generate stunning social media banners and ads with AI. Upload product photos, add prompts, and create Instagram, Facebook, LinkedIn ads instantly. Free AI ad maker.',
  keywords: 'AI banner generator, social media banner, AI ad maker, Instagram ads, Facebook ads, product ads, eCommerce banners',
  openGraph: {
    title: 'AI Social Media Banner Generator - Create Ads Instantly',
    description: 'Generate stunning social media banners and ads with AI. Perfect for eCommerce sellers and marketers.',
    type: 'website',
  }
}

export default function Page() {
  return <AIBannerGeneratorPage />
}

