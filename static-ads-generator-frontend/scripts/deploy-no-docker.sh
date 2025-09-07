#!/bin/bash

# Digital Ocean Deployment Script (No Docker)
# This script handles the deployment process on your Digital Ocean server

set -e

# Configuration
APP_NAME="static-ads-frontend"
APP_DIR="/opt/static-ads-frontend"
CURRENT_DIR="$APP_DIR/current"
BACKUP_DIR="$APP_DIR/backup-$(date +%Y%m%d-%H%M%S)"
PORT=3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2 is not installed. Please install PM2 first.${NC}"
    exit 1
fi

# Stop existing application
echo -e "${YELLOW}Stopping existing application...${NC}"
sudo systemctl stop static-ads-frontend || true
pm2 stop static-ads-frontend || true

# Create backup of current deployment
if [ -d "$CURRENT_DIR" ]; then
    echo -e "${YELLOW}Creating backup...${NC}"
    sudo mv "$CURRENT_DIR" "$BACKUP_DIR"
fi

# Create new deployment directory
echo -e "${YELLOW}Creating new deployment directory...${NC}"
mkdir -p "$CURRENT_DIR"

# Wait for deployment files to be ready
echo -e "${YELLOW}Waiting for deployment files...${NC}"
sleep 5

# Check if deployment files exist
if [ ! -f "$CURRENT_DIR/package.json" ]; then
    echo -e "${RED}Deployment files not found. Please check the deployment process.${NC}"
    exit 1
fi

# Install production dependencies
echo -e "${YELLOW}Installing production dependencies...${NC}"
cd "$CURRENT_DIR"
npm ci --only=production

# Run database migrations if needed
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${YELLOW}Running database migrations...${NC}"
    npx prisma generate
    npx prisma migrate deploy || true
fi

# Set proper permissions
echo -e "${YELLOW}Setting permissions...${NC}"
sudo chown -R $USER:$USER "$CURRENT_DIR"
chmod +x "$CURRENT_DIR/package.json"

# Start the application with PM2
echo -e "${YELLOW}Starting application with PM2...${NC}"
cd "$APP_DIR"
pm2 start ecosystem.config.js

# Wait for application to start
echo -e "${YELLOW}Waiting for application to start...${NC}"
sleep 15

# Check if application is running
echo -e "${YELLOW}Checking application health...${NC}"
if curl -f http://localhost:$PORT/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}Application is running on port $PORT${NC}"
    
    # Show application status
    echo -e "${YELLOW}Application status:${NC}"
    pm2 status static-ads-frontend
    
    # Show recent logs
    echo -e "${YELLOW}Recent logs:${NC}"
    pm2 logs static-ads-frontend --lines 10
    
    # Clean up old backups (keep last 3)
    echo -e "${YELLOW}Cleaning up old backups...${NC}"
    ls -t "$APP_DIR"/backup-* 2>/dev/null | tail -n +4 | xargs -r rm -rf
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo -e "${RED}Application is not responding. Check logs:${NC}"
    pm2 logs static-ads-frontend --lines 20
    
    # Rollback to previous version
    echo -e "${YELLOW}Attempting rollback...${NC}"
    pm2 stop static-ads-frontend || true
    pm2 delete static-ads-frontend || true
    
    if [ -d "$BACKUP_DIR" ]; then
        echo -e "${YELLOW}Rolling back to previous version...${NC}"
        sudo rm -rf "$CURRENT_DIR"
        sudo mv "$BACKUP_DIR" "$CURRENT_DIR"
        cd "$APP_DIR"
        pm2 start ecosystem.config.js
        sleep 10
        
        if curl -f http://localhost:$PORT/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Rollback successful!${NC}"
        else
            echo -e "${RED}❌ Rollback failed!${NC}"
        fi
    fi
    
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "• Check status: pm2 status"
echo -e "• View logs: pm2 logs static-ads-frontend"
echo -e "• Restart: pm2 restart static-ads-frontend"
echo -e "• Monitor: pm2 monit"
