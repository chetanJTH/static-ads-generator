/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/remove-bg',
        destination: 'http://localhost:8000/remove-bg',
      },
      {
        source: '/api/design-card',
        destination: 'http://localhost:8000/design-card',
      },
      {
        source: '/api/health',
        destination: 'http://localhost:8000/health',
      },
    ]
  },
}

module.exports = nextConfig
