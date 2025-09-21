import type { Metadata } from 'next'
import './globals.css'
import Providers from '../components/Providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://kraftey.com'),
  title: 'Kraftey - AI Image Upscaler & Background Remover | Enhance Image Quality Free',
  description: 'Free AI image upscaler and background remover. Enhance image quality 4x, increase resolution, and remove backgrounds instantly. Professional AI tools for creators and businesses.',
  keywords: 'AI image upscaler, enhance image quality, increase image resolution, 4x upscale, image enhancement, background remover, AI image tools, upscale image free, photo enhancer, image quality improvement',
  authors: [{ name: 'Kraftey Team' }],
  creator: 'Kraftey',
  publisher: 'Kraftey',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kraftey.com',
    siteName: 'Kraftey',
    title: 'Kraftey - Background Remove & AI Tools to Design, Edit & Create Faster',
    description: 'Free AI tools for creators: Remove backgrounds, generate banners, create videos, and write copy.',
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
    title: 'Kraftey - Background Remove & AI Tools to Design, Edit & Create Faster',
    description: 'Free AI tools for creators: Remove backgrounds, generate banners, create videos, and write copy.',
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
  const jsonLd = [
    // WebSite Schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Kraftey',
      description: 'Free AI background remove tool and creative suite: Remove backgrounds instantly, generate banners, create videos, and write copy.',
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
    },
    // SoftwareApplication Schema
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Kraftey - AI Background Remover & Content Creation Suite',
      description: 'Free AI-powered background removal tool and comprehensive content creation suite. Remove backgrounds instantly, generate banners, create videos, and write copy with advanced AI technology.',
      url: 'https://kraftey.com',
      downloadUrl: 'https://kraftey.com/remove-background',
      applicationCategory: 'MultimediaApplication',
      applicationSubCategory: 'Image Editing',
      operatingSystem: 'Web Browser, Windows, macOS, Linux, iOS, Android',
      browserRequirements: 'Chrome, Firefox, Safari, Edge - Latest versions',
      softwareVersion: '1.0.0',
      datePublished: '2024-01-01',
      dateModified: '2024-12-01',
      author: {
        '@type': 'Organization',
        name: 'Kraftey Team',
        url: 'https://kraftey.com/about'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Kraftey',
        url: 'https://kraftey.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://kraftey.com/logo.png',
          width: 512,
          height: 512
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '2847',
        reviewCount: '892'
      },
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Plan',
          description: 'Perfect for individuals and small projects',
          price: '0',
          priceCurrency: 'USD',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
          validFrom: '2024-01-01',
          category: 'Free',
          itemOffered: {
            '@type': 'SoftwareApplication',
            name: 'Kraftey Free'
          },
          includesObject: [
            {
              '@type': 'TypeAndQuantityNode',
              amountOfThisGood: 'Unlimited',
              typeOfGood: 'Background Removal'
            },
            {
              '@type': 'TypeAndQuantityNode',
              amountOfThisGood: 'Unlimited',
              typeOfGood: 'HD Downloads'
            }
          ]
        },
        {
          '@type': 'Offer',
          name: 'Pro Plan',
          description: 'For professionals and growing businesses',
          price: '9',
          priceCurrency: 'USD',
          billingPeriod: 'Monthly',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/PreOrder',
          validFrom: '2024-01-01',
          category: 'Premium',
          itemOffered: {
            '@type': 'SoftwareApplication',
            name: 'Kraftey Pro'
          },
          includesObject: [
            {
              '@type': 'TypeAndQuantityNode',
              amountOfThisGood: 'Unlimited',
                typeOfGood: 'AI Image Enhancement'
            },
            {
              '@type': 'TypeAndQuantityNode',
              amountOfThisGood: 'Unlimited',
              typeOfGood: 'Bulk Processing'
            },
            {
              '@type': 'TypeAndQuantityNode',
              amountOfThisGood: 'Full',
              typeOfGood: 'API Access'
            }
          ]
        },
        {
          '@type': 'Offer',
          name: 'Enterprise Plan',
          description: 'For large teams and organizations',
          price: 'Contact for pricing',
          priceCurrency: 'USD',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
          validFrom: '2024-01-01',
          category: 'Enterprise',
          itemOffered: {
            '@type': 'SoftwareApplication',
            name: 'Kraftey Enterprise'
          }
        }
      ],
      featureList: [
        'AI-powered background removal',
        'HD quality image processing',
        'Transparent PNG output',
        'Bulk image processing',
        'AI image upscaling and enhancement',
        'Multiple file format support',
        'Commercial license included',
        'API integration',
        'Priority customer support',
        'No watermarks',
        'Instant processing',
        'Web-based application'
      ],
      screenshot: [
        {
          '@type': 'ImageObject',
          url: 'https://kraftey.com/screenshots/background-removal.jpg',
          caption: 'AI Background Removal Interface'
        },
        {
          '@type': 'ImageObject',
          url: 'https://kraftey.com/screenshots/image-upscaler.jpg',
          caption: 'AI Image Upscaler Tool'
        }
      ],
      video: {
        '@type': 'VideoObject',
        name: 'How to Remove Backgrounds with Kraftey',
        description: 'Learn how to remove backgrounds from images using Kraftey\'s AI-powered tool',
        thumbnailUrl: 'https://kraftey.com/video-thumbnail.jpg',
        uploadDate: '2024-01-15',
        duration: 'PT2M30S',
        contentUrl: 'https://kraftey.com/demo-video.mp4'
      },
      keywords: 'AI image upscaler, enhance image quality, increase resolution, 4x upscale, background remover, AI image editing, transparent background, PNG converter, bulk image processing, photo enhancer, content creation, photo editing',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://kraftey.com'
      },
      sameAs: [
        'https://twitter.com/kraftey',
        'https://linkedin.com/company/kraftey'
      ],
      potentialAction: {
        '@type': 'UseAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://kraftey.com/remove-background',
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform'
          ]
        }
      }
    }
  ]

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-11324883721"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-11324883721');
              
              // Conversion tracking function
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-11324883721/7OqlCMnpl_0ZEImGkJgq',
                    'value': 1.0,
                    'currency': 'INR',
                    'event_callback': callback
                });
                return false;
              }
            `
          }}
        />
        
        {/* Google AdSense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-9525032831778850" />
        
        {/* Google AdSense Script */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9525032831778850"
          crossOrigin="anonymous"
        ></script>
        
        {/* Structured Data */}
        {jsonLd.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
