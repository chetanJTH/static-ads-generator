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
        destination: `${process.env.NEXT_PUBLIC_API_BASE || 'https://staticapi.kraftey.com'}/remove-bg`,
      },
      {
        source: '/api/design-card',
        destination: `${process.env.NEXT_PUBLIC_API_BASE || 'https://staticapi.kraftey.com'}/design-card`,
      },
      {
        source: '/api/health',
        destination: `${process.env.NEXT_PUBLIC_API_BASE || 'https://staticapi.kraftey.com'}/health`,
      },
    ]
  },
}

module.exports = nextConfig
