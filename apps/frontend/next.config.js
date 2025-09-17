/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output to fix production build issues
  // output: 'standalone',
  
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    unoptimized: false,
  },
  
  // Ensure proper static file handling
  trailingSlash: false,
  
  // Add cache headers for sitemap
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
  
  // Ensure clean build process
  distDir: '.next',
  
  // Handle static exports properly
  async generateBuildId() {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
