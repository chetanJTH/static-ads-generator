/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  // Removed rewrites - now using direct API routes for better control
}

module.exports = nextConfig
