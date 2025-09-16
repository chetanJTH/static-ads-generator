import ImageUpscalerPage from './ImageUpscalerPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Upscaler - Enhance Image Quality | Kraftey',
  description: 'Enhance your images with AI-powered upscaling technology. Increase resolution 4x and improve quality with our advanced upscaling algorithm. Fast, free, and professional results.',
  keywords: 'image upscaler, AI upscaling, enhance image quality, increase resolution, image enhancement, photo upscaler, AI image processing',
  openGraph: {
    title: 'AI Image Upscaler - Enhance Image Quality | Kraftey',
    description: 'Enhance your images with AI-powered upscaling technology. Increase resolution 4x and improve quality instantly.',
    type: 'website',
    images: [
      {
        url: '/og-upscaler.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Image Upscaler - Kraftey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Upscaler - Enhance Image Quality | Kraftey',
    description: 'Enhance your images with AI-powered upscaling technology. Increase resolution 4x and improve quality instantly.',
    images: ['/og-upscaler.jpg'],
  }
}

export default function Page() {
  return <ImageUpscalerPage />
}
