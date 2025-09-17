'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  adStyle?: React.CSSProperties
  className?: string
  fullWidthResponsive?: boolean
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
  fullWidthResponsive = true
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Push ad to AdSense queue
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-9525032831778850"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      ></ins>
    </div>
  )
}

// Pre-configured ad components for common placements
export function BannerAd({ adSlot, className = '' }: { adSlot: string, className?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="auto"
      adStyle={{ display: 'block', width: '100%', height: '90px' }}
      className={`banner-ad ${className}`}
    />
  )
}

export function SidebarAd({ adSlot, className = '' }: { adSlot: string, className?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="vertical"
      adStyle={{ display: 'block', width: '300px', height: '600px' }}
      className={`sidebar-ad ${className}`}
    />
  )
}

export function InContentAd({ adSlot, className = '' }: { adSlot: string, className?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="rectangle"
      adStyle={{ display: 'block', width: '100%', height: '250px' }}
      className={`in-content-ad ${className}`}
    />
  )
}

export function ResponsiveAd({ adSlot, className = '' }: { adSlot: string, className?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="auto"
      adStyle={{ display: 'block' }}
      className={`responsive-ad ${className}`}
      fullWidthResponsive={true}
    />
  )
}
