import type { Metadata } from 'next'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WatermarkRemoverClient from './WatermarkRemoverClient'

export const metadata: Metadata = {
  title: 'Free AI Watermark Remover | Remove Watermarks from Images Instantly - Kraftey',
  description: 'Remove watermarks from images instantly with our free AI-powered watermark remover. Clean, professional results in seconds. No sign-up required. Perfect for content creators.',
  keywords: 'watermark remover, remove watermark, AI watermark removal, free watermark remover, clean images, remove logo from image, photo watermark removal, image editing',
  openGraph: {
    title: 'Free AI Watermark Remover - Remove Watermarks Instantly',
    description: 'Remove watermarks from images instantly with our free AI-powered tool. Clean, professional results in seconds.',
    url: 'https://kraftey.com/watermark-remover',
    siteName: 'Kraftey',
    images: [
      {
        url: 'https://kraftey.com/og-watermark-remover.jpg',
        width: 1200,
        height: 630,
        alt: 'Kraftey AI Watermark Remover Tool',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Watermark Remover - Remove Watermarks Instantly',
    description: 'Remove watermarks from images instantly with our free AI-powered tool. Clean, professional results in seconds.',
    images: ['https://kraftey.com/og-watermark-remover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function WatermarkRemoverPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Kraftey AI Watermark Remover',
    description: 'Free AI-powered watermark removal tool. Remove watermarks from images instantly with advanced AI technology.',
    url: 'https://kraftey.com/watermark-remover',
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Image Editing',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Chrome, Firefox, Safari, Edge - Latest versions',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free watermark removal with AI'
    },
    featureList: [
      'AI-powered watermark removal',
      'Instant processing',
      'High quality output',
      'Multiple image formats supported',
      'No sign-up required',
      'Free unlimited usage'
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <WatermarkRemoverClient />
      </div>

      <Footer />
    </div>
  )
}