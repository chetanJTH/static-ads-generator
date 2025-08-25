# Kraftey - AI Tools for Content Creation

A comprehensive platform offering AI-powered tools for content creators. Built with Next.js, NextAuth.js, and FastAPI.

## Features

- 🔐 **Google OAuth Authentication** - Secure user authentication
- 🖼️ **Background Removal** - AI-powered background removal (Live)
- 🎨 **AI Banner Generator** - Create social media banners (Coming Soon)
- 🎬 **AI Video Generator** - Transform images to videos (Planned)
- ✍️ **AI Text Generator** - Generate copy and headlines (Planned)
- 📱 **Responsive Design** - Works on all devices
- 💾 **HD Downloads** - High-quality output files
- 🌍 **SEO Optimized** - Full SEO structure with blog and landing pages

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy your Client ID and Client Secret

### 3. Environment Variables

Create a `.env` file in the `apps/web` directory with the following variables:

```env
# Next.js Configuration
NEXT_PUBLIC_API_BASE=http://localhost:8000

# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Override default settings
NEXT_PUBLIC_APP_NAME="Background Remover"
```

### 4. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Server

Make sure the FastAPI server is running on port 8000. You can start it from the root directory:

```bash
npm run dev:api
```

## Usage

1. Sign in with your Google account
2. Upload an image by dragging and dropping or clicking the upload area
3. Click "Remove Background" to process the image
4. Download the processed image with transparent background

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: SQLite with Prisma ORM
- **Backend**: FastAPI (Python)
- **Image Processing**: rembg library

## Deployment

For production deployment:

1. Update environment variables with production values
2. Set up a production database (PostgreSQL recommended)
3. Configure Google OAuth with production redirect URIs
4. Deploy the Next.js app and FastAPI server
