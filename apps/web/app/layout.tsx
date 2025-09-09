import type { Metadata } from 'next'
import './globals.css'
import Providers from '../components/Providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://kraftey.com'),
  title: 'Kraftey - AI Tools to Design, Edit & Create Faster',
  description: 'Free AI-powered tools for creators: Remove backgrounds, generate banners, create videos, and write copy. Transform your content creation workflow with Kraftey.',
  keywords: 'AI tools, background remover, banner generator, content creation, free AI, remove background online, AI banner maker',
  authors: [{ name: 'Kraftey Team' }],
  creator: 'Kraftey',
  publisher: 'Kraftey',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kraftey.com',
    siteName: 'Kraftey',
    title: 'Kraftey - AI Tools to Design, Edit & Create Faster',
    description: 'Free AI-powered tools for creators: Remove backgrounds, generate banners, create videos, and write copy.',
    images: [
      {
        url: 'https://kraftey.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kraftey - AI Tools for Content Creation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kraftey - AI Tools to Design, Edit & Create Faster',
    description: 'Free AI-powered tools for creators: Remove backgrounds, generate banners, create videos, and write copy.',
    images: ['https://kraftey.com/og-image.jpg'],
    creator: '@kraftey',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kraftey',
    description: 'Free AI-powered tools for creators: Remove backgrounds, generate banners, create videos, and write copy.',
    url: 'https://kraftey.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kraftey.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://twitter.com/kraftey',
      'https://linkedin.com/company/kraftey'
    ]
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
