# Frontend Deployment Guide

This guide covers deploying the Static Ads Generator Frontend to various platforms.

## Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your `static-ads-generator-frontend` repository

2. **Configure build settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set environment variables**
   - Go to Project Settings > Environment Variables
   - Add the following variables:
     ```
     NEXT_PUBLIC_API_BASE=https://your-backend-domain.com
     NEXTAUTH_URL=https://your-frontend-domain.com
     NEXTAUTH_SECRET=your-secret-key
     DATABASE_URL=your-database-url
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

## Railway Deployment

1. **Create a new project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Connect your repository**
   - Select the `static-ads-generator-frontend` repository
   - Railway will automatically detect the Next.js project

3. **Set environment variables**
   - Add all required environment variables in Railway dashboard

4. **Deploy**
   - Railway will automatically build and deploy

## Netlify Deployment

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Set environment variables**
   - Go to Site settings > Environment variables
   - Add all required variables

4. **Deploy**
   - Netlify will automatically build and deploy

## Docker Deployment

1. **Build the image**
   ```bash
   docker build -t static-ads-frontend .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_API_BASE=https://your-backend-domain.com \
     -e NEXTAUTH_URL=https://your-frontend-domain.com \
     -e NEXTAUTH_SECRET=your-secret-key \
     static-ads-frontend
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_BASE` | Backend API base URL | Yes |
| `NEXTAUTH_URL` | Frontend application URL | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes |
| `DATABASE_URL` | Database connection string | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_BASE_URL` | Base URL for SEO | No |

## Database Setup

For production, you'll need to set up a database:

1. **Railway PostgreSQL** (Recommended)
   - Create a PostgreSQL database on Railway
   - Use the connection string as `DATABASE_URL`

2. **Supabase**
   - Create a project on Supabase
   - Use the connection string as `DATABASE_URL`

3. **PlanetScale**
   - Create a database on PlanetScale
   - Use the connection string as `DATABASE_URL`

## Post-Deployment

1. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

2. **Update CORS settings**
   - Update your backend's `CORS_ORIGINS` to include your frontend domain

3. **Test the deployment**
   - Visit your deployed frontend
   - Test all functionality
   - Check API connectivity

