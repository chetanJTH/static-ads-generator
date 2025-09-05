# Static Ads Generator Frontend

A Next.js frontend application for the Static Ads Generator platform.

## Features

- Modern React-based UI with Next.js 14
- Background removal tool
- AI banner generator
- Blog and content pages
- Authentication with NextAuth.js
- Responsive design with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Environment Variables

- `NEXT_PUBLIC_API_BASE`: Backend API base URL
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Application URL
- Database and authentication provider variables

## Deployment

### Vercel (Recommended)
The project is configured for Vercel deployment with the included `vercel.json`.

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **Railway**: Use the included configuration
- **Docker**: Create a Dockerfile for containerized deployment

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── about/          # About page
│   ├── blog/           # Blog pages
│   └── ...
├── components/         # Reusable React components
├── lib/               # Utility functions
└── prisma/            # Database schema
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

- **Background Removal**: AI-powered background removal tool
- **AI Banner Generator**: Generate banners with AI
- **Blog System**: Content management and blog posts
- **Authentication**: User authentication and management
- **Responsive Design**: Mobile-first responsive design