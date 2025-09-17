import { Metadata } from 'next'
import TermsConditionsPage from './TermsConditionsPage'

export const metadata: Metadata = {
  title: 'Terms and Conditions - Kraftey AI Image Tools',
  description: 'Read our terms and conditions for using Kraftey AI image upscaler and background removal tools. User agreements and service terms.',
  keywords: 'terms and conditions, user agreement, service terms, AI tools terms, image processing terms',
  openGraph: {
    title: 'Terms and Conditions - Kraftey AI Image Tools',
    description: 'Read our terms and conditions for using Kraftey AI image tools.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kraftey.com/terms'
  }
}

export default function Page() {
  return <TermsConditionsPage />
}
