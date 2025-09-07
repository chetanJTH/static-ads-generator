#!/bin/bash

# Production deployment script for Static Ads Generator API

set -e

echo "🚀 Deploying Static Ads Generator API to Production"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy env.production to .env and update with your actual values."
    exit 1
fi

# Build and start the application
echo "📦 Building Docker image..."
docker-compose -f docker-compose.prod.yml build

echo "🔄 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

echo "🚀 Starting production containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:8000/health; then
    echo "✅ Deployment successful! API is running."
    echo "🌐 API URL: http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/docs (development only)"
else
    echo "❌ Health check failed!"
    echo "📋 Checking logs..."
    docker-compose -f docker-compose.prod.yml logs api
    exit 1
fi

echo "🎉 Deployment completed successfully!"
