/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/remove-bg',
        destination: `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/remove-bg`,
      },
      {
        source: '/api/design-card',
        destination: `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/design-card`,
      },
      {
        source: '/api/health',
        destination: `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/health`,
      },
    ]
  },
}

module.exports = nextConfig
