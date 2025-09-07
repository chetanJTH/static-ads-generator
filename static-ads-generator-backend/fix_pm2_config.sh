#!/bin/bash

# Script to fix PM2 configuration issues on Ubuntu server

set -e

echo "🔧 Fixing PM2 Configuration Issues"

APP_DIR="/opt/hosting/kraftey-static-ads-backend"
SERVICE_USER="www-data"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

echo "🛑 Stopping current PM2 processes..."
sudo -u $SERVICE_USER pm2 stop all || true
sudo -u $SERVICE_USER pm2 delete all || true

echo "📁 Updating PM2 configuration..."

cd $APP_DIR

# Backup current config
cp ecosystem.config.js ecosystem.config.js.backup

# Use the Python-specific configuration
cp ecosystem-python.config.js ecosystem.config.js

echo "✅ Updated PM2 configuration"

# Verify Python virtual environment
echo "🐍 Verifying Python environment..."
if [ ! -f "$APP_DIR/venv/bin/uvicorn" ]; then
    echo "❌ Uvicorn not found in virtual environment"
    echo "📦 Installing dependencies..."
    sudo -u $SERVICE_USER ./venv/bin/pip install -r requirements.txt
fi

# Test the configuration
echo "🧪 Testing PM2 configuration..."
cd $APP_DIR

# Start with the new configuration
echo "🚀 Starting application with PM2..."
sudo -u $SERVICE_USER pm2 start ecosystem.config.js --env production

# Wait for startup
echo "⏳ Waiting for application to start..."
sleep 10

# Check status
echo "📊 PM2 Status:"
sudo -u $SERVICE_USER pm2 status

# Test the API
echo "🏥 Testing API health..."
if curl -f http://localhost:8000/health; then
    echo "✅ API is running successfully!"
else
    echo "❌ API health check failed!"
    echo "📋 Checking PM2 logs..."
    sudo -u $SERVICE_USER pm2 logs static-ads-generator-backend --lines 20
    exit 1
fi

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
sudo -u $SERVICE_USER pm2 save

echo "🎉 PM2 configuration fix completed!"
echo ""
echo "📝 PM2 Management Commands:"
echo "  pm2 status                    - Check status"
echo "  pm2 logs static-ads-generator-backend - View logs"
echo "  pm2 restart static-ads-generator-backend - Restart app"
echo "  pm2 stop static-ads-generator-backend - Stop app"
echo "  pm2 monit                     - Monitor dashboard"
