#!/bin/bash

# Production startup script for Static Ads Generator API

set -e

echo "🚀 Starting Static Ads Generator API in Production Mode"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Using default environment variables."
fi

# Create necessary directories
mkdir -p uploads logs

# Set production environment
export ENVIRONMENT=production

# Start the application with Gunicorn for production
echo "📡 Starting server with Gunicorn..."
exec gunicorn main:app \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    --timeout 120 \
    --keep-alive 2 \
    --max-requests 1000 \
    --max-requests-jitter 100
