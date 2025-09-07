# Frontend Deployment Guide

This guide covers deploying the Static Ads Generator Frontend to Digital Ocean using automated CI/CD.

## Digital Ocean Deployment (Recommended)

This project is configured for automated deployment to Digital Ocean using GitHub Actions.

### Prerequisites

- Digital Ocean droplet/server
- Domain name (optional but recommended)
- GitHub repository with proper secrets configured

### Quick Setup

1. **Set up your Digital Ocean server**
   ```bash
   scp scripts/setup-server-no-docker.sh root@YOUR_SERVER_IP:/tmp/
   ssh root@YOUR_SERVER_IP
   chmod +x /tmp/setup-server-no-docker.sh
   /tmp/setup-server-no-docker.sh
   ```

2. **Configure GitHub secrets** in your repository settings
3. **Push to main branch** - deployment happens automatically!

### Manual Deployment

If you need to deploy manually:

```bash
# On your server
cd /opt/static-ads-frontend
./scripts/deploy-no-docker.sh
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

