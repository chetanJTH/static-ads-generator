import { Metadata } from 'next'
import RemoveBackgroundPage from './RemoveBackgroundPage'

export const metadata: Metadata = {
  title: 'Remove Background Online Free - AI Background Remover | Kraftey',
  description: 'Remove image backgrounds instantly with AI. Free online background remover tool. Perfect for product photos, portraits, and social media. HD quality, transparent PNG downloads.',
  keywords: 'remove background, background remover, AI remove background, free background removal, transparent background, product photos',
  openGraph: {
    title: 'Remove Background Online Free - AI Background Remover',
    description: 'Remove image backgrounds instantly with AI. Free, fast, and HD quality results.',
    type: 'website',
  }
}

export default function Page() {
  return <RemoveBackgroundPage />
}

