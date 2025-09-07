#!/bin/bash

# Digital Ocean Deployment Script
# This script handles the deployment process on your Digital Ocean server

set -e

# Configuration
APP_NAME="static-ads-frontend"
CONTAINER_NAME="static-ads-frontend"
IMAGE_NAME="ghcr.io/your-username/static-ads-generator-frontend:latest"
PORT=3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Login to GitHub Container Registry
echo -e "${YELLOW}Logging in to GitHub Container Registry...${NC}"
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin

# Pull the latest image
echo -e "${YELLOW}Pulling latest image...${NC}"
docker pull $IMAGE_NAME

# Stop and remove existing container if it exists
echo -e "${YELLOW}Stopping existing container...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Run new container
echo -e "${YELLOW}Starting new container...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:3000 \
    -e NODE_ENV=production \
    -e NEXT_PUBLIC_API_BASE="$NEXT_PUBLIC_API_BASE" \
    -e NEXTAUTH_URL="$NEXTAUTH_URL" \
    -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
    -e DATABASE_URL="$DATABASE_URL" \
    -e GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
    -e GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
    $IMAGE_NAME

# Wait for container to start
echo -e "${YELLOW}Waiting for container to start...${NC}"
sleep 10

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}Container is running on port $PORT${NC}"
    
    # Show container logs
    echo -e "${YELLOW}Container logs:${NC}"
    docker logs $CONTAINER_NAME --tail 20
    
    # Clean up old images
    echo -e "${YELLOW}Cleaning up old images...${NC}"
    docker image prune -f
    
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo -e "${RED}Container is not running. Check logs:${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
