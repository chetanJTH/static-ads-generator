import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - Kraftey',
  description: 'Admin panel for managing Kraftey content',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
