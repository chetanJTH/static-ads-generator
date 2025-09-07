#!/bin/bash

# Simple startup script for Static Ads Generator API
# Alternative to PM2 for troubleshooting

set -e

APP_DIR="/opt/hosting/kraftey-static-ads-backend"
SERVICE_USER="www-data"

echo "🚀 Starting Static Ads Generator API"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

cd $APP_DIR

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    exit 1
fi

# Check if uvicorn is installed
if [ ! -f "venv/bin/uvicorn" ]; then
    echo "📦 Installing dependencies..."
    sudo -u $SERVICE_USER ./venv/bin/pip install -r requirements.txt
fi

# Set environment variables
export ENVIRONMENT=production
export PORT=8000
export HOST=127.0.0.1

# Start the application
echo "🚀 Starting application..."
sudo -u $SERVICE_USER ./venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
