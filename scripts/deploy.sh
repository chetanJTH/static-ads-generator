#!/bin/bash

# Deployment Script for Static Ads Generator
# Server: 139.59.69.68
# Enhanced for automated deployment

set -e  # Exit on any error

echo "🚀 Deploying Static Ads Generator to production..."

# Set variables
APP_DIR="/root/static-ads-generator"
BACKEND_DIR="$APP_DIR/apps/api"
FRONTEND_DIR="$APP_DIR/apps/web"
LOG_DIR="$APP_DIR/logs"

# Create logs directory if it doesn't exist
mkdir -p $LOG_DIR

# Navigate to app directory
cd $APP_DIR

# Pull latest code from Git
echo "📥 Pulling latest code from Git..."
git pull origin main

# Backend deployment
echo "🔧 Setting up backend..."
cd $BACKEND_DIR

# Activate virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3.9 -m venv venv
fi

source venv/bin/activate

# Install/update Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy production environment file
if [ -f "env.production" ]; then
    cp env.production .env
    echo "✅ Backend environment configured"
else
    echo "⚠️  Warning: env.production not found. Please create it."
fi

# Frontend deployment
echo "🎨 Setting up frontend..."
cd $FRONTEND_DIR

# Install/update Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm ci --production=false

# Copy production environment file
if [ -f "env.production" ]; then
    cp env.production .env
    echo "✅ Frontend environment configured"
else
    echo "⚠️  Warning: env.production not found. Please create it."
fi

# Build frontend for production
echo "🏗️ Building frontend for production..."
npm run build

# Restart PM2 processes
echo "🔄 Restarting applications with PM2..."
cd $APP_DIR

# Stop existing processes gracefully
pm2 stop all || echo "No PM2 processes to stop"

# Start backend
echo "🚀 Starting backend..."
cd $BACKEND_DIR
pm2 start ecosystem.config.js --env production

# Start frontend
echo "🚀 Starting frontend..."
cd $FRONTEND_DIR
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot (only if not already set)
pm2 startup | grep -v "already" || echo "PM2 startup already configured"

# Wait a moment for services to start
sleep 5

# Check if services are running
echo "📊 Checking service status..."
pm2 status

# Health check
echo "🏥 Performing health checks..."
sleep 10

# Check backend health
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    pm2 logs static-ads-backend --lines 10
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
    pm2 logs static-ads-frontend --lines 10
fi

echo "✅ Deployment complete!"
echo "🌐 Your application is now running:"
echo "   Frontend: https://kraftey.com"
echo "   Backend:  https://staticapi.kraftey.com"
echo "   API Docs: https://staticapi.kraftey.com/docs"
echo ""
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs"
echo "🔄 Restart with: pm2 restart all"

