#!/bin/bash

# Script to fix CORS issues on production server

set -e

echo "🔧 Fixing CORS Configuration on Production Server"

APP_DIR="/opt/hosting/kraftey-static-ads-backend"
SERVICE_USER="www-data"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

echo "📁 Updating application files..."

# Update main.py with CORS fixes
cd $APP_DIR

# Backup current main.py
cp main.py main.py.backup

# Update the application
echo "🔄 Pulling latest changes..."
sudo -u $SERVICE_USER git pull

# Update environment file
echo "⚙️ Updating environment configuration..."
if [ -f .env ]; then
    # Update CORS_ORIGINS in .env
    sed -i 's/CORS_ORIGINS=.*/CORS_ORIGINS=https:\/\/kraftey.com,https:\/\/www.kraftey.com,https:\/\/staticapi.kraftey.com/' .env
    echo "✅ Updated CORS_ORIGINS in .env"
else
    echo "⚠️ .env file not found, creating from template..."
    cp env.production .env
    echo "✅ Created .env from template"
fi

# Install any new dependencies
echo "📦 Installing dependencies..."
sudo -u $SERVICE_USER ./venv/bin/pip install -r requirements.txt

# Restart the application
echo "🔄 Restarting application..."
sudo -u $SERVICE_USER pm2 restart static-ads-generator-backend

# Wait for restart
echo "⏳ Waiting for application to restart..."
sleep 5

# Test the API
echo "🏥 Testing API health..."
if curl -f http://localhost:8000/health; then
    echo "✅ API is running successfully!"
else
    echo "❌ API health check failed!"
    echo "📋 Checking logs..."
    sudo -u $SERVICE_USER pm2 logs static-ads-generator-backend --lines 20
    exit 1
fi

# Test CORS
echo "🌐 Testing CORS configuration..."
CORS_TEST=$(curl -s -H "Origin: https://kraftey.com" -H "Access-Control-Request-Method: POST" -X OPTIONS https://staticapi.kraftey.com/remove-bg/ -w "%{http_code}" -o /dev/null)

if [ "$CORS_TEST" = "200" ]; then
    echo "✅ CORS preflight test passed!"
else
    echo "❌ CORS preflight test failed (HTTP $CORS_TEST)"
fi

echo "🎉 CORS fix deployment completed!"
echo ""
echo "📝 Next steps:"
echo "1. Test your frontend application"
echo "2. Check browser developer tools for CORS errors"
echo "3. Monitor logs: sudo -u $SERVICE_USER pm2 logs static-ads-generator-backend"
