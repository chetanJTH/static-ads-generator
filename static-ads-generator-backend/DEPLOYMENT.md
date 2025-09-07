# Backend Deployment Guide

This guide covers deploying the Static Ads Generator Backend to various platforms.

## Railway Deployment (Recommended)

1. **Create a new project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Connect your repository**
   - Select the `static-ads-generator-backend` repository
   - Railway will automatically detect the Python project

3. **Set environment variables**
   - Go to your project settings
   - Add the following variables:
     ```
     REPLICATE_API_TOKEN=your_token_here
     REMOVE_BG_API_KEY=your_key_here
     CLIPDROP_API_KEY=your_key_here
     CORS_ORIGINS=https://your-frontend-domain.com
     ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Your API will be available at the provided Railway URL

## Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-backend-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set REPLICATE_API_TOKEN=your_token_here
   heroku config:set REMOVE_BG_API_KEY=your_key_here
   heroku config:set CLIPDROP_API_KEY=your_key_here
   heroku config:set CORS_ORIGINS=https://your-frontend-domain.com
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Docker Deployment

1. **Build the image**
   ```bash
   docker build -t static-ads-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 8000:8000 \
     -e REPLICATE_API_TOKEN=your_token_here \
     -e REMOVE_BG_API_KEY=your_key_here \
     -e CLIPDROP_API_KEY=your_key_here \
     -e CORS_ORIGINS=https://your-frontend-domain.com \
     static-ads-backend
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REPLICATE_API_TOKEN` | Replicate API token for AI services | Yes |
| `REMOVE_BG_API_KEY` | Remove.bg API key | Yes |
| `CLIPDROP_API_KEY` | Clipdrop API key | Yes |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | Yes |
| `PORT` | Port to run the server on | No (default: 8000) |

## Health Check

The API includes a health check endpoint at `/health` that returns the service status.

## API Documentation

Once deployed, visit `https://your-api-domain.com/docs` for interactive API documentation.

