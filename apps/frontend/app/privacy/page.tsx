import { Metadata } from 'next'
import PrivacyPolicyPage from './PrivacyPolicyPage'

export const metadata: Metadata = {
  title: 'Privacy Policy - Kraftey AI Image Tools',
  description: 'Learn how Kraftey protects your privacy when using our AI image upscaler and background removal tools. Our commitment to data security and user privacy.',
  keywords: 'privacy policy, data protection, user privacy, image processing privacy, AI tools privacy',
  openGraph: {
    title: 'Privacy Policy - Kraftey AI Image Tools',
    description: 'Learn how Kraftey protects your privacy when using our AI image tools.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kraftey.com/privacy'
  }
}

export default function Page() {
  return <PrivacyPolicyPage />
}
