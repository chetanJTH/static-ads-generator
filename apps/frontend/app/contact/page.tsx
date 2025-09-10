import { Metadata } from 'next'
import ContactPage from './ContactPage'

export const metadata: Metadata = {
  title: 'Contact Kraftey - Get Support & Enterprise Sales | Kraftey',
  description: 'Get in touch with the Kraftey team for support, enterprise sales, partnerships, or general inquiries. We\'re here to help!',
  keywords: 'contact kraftey, support, enterprise sales, partnerships, help',
  openGraph: {
    title: 'Contact Kraftey - Get Support & Enterprise Sales',
    description: 'Get in touch with the Kraftey team for support and inquiries.',
    type: 'website',
  }
}

export default function Page() {
  return <ContactPage />
}





