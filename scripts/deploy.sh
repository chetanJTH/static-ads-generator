#!/bin/bash

# Production Deployment Script
# This script handles the complete deployment process with proper error handling

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "ecosystem.config.js" ]; then
    print_error "Not in the correct directory. Please run from project root."
    exit 1
fi

print_status "Stopping PM2 services..."
pm2 stop ecosystem.config.js || print_warning "PM2 services were not running"

print_status "Pulling latest changes from GitHub..."
git pull origin main

# Preserve existing .env files on server
print_status "Preserving existing environment files..."
if [ -f "apps/frontend/.env.production" ]; then
    cp apps/frontend/.env.production apps/frontend/.env.production.backup
    print_success "Backed up frontend .env.production"
fi

if [ -f "apps/backend/.env.production" ]; then
    cp apps/backend/.env.production apps/backend/.env.production.backup
    print_success "Backed up backend .env.production"
fi

if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    print_success "Backed up root .env.local"
fi

print_status "Fixing file permissions..."
chown -R root:root .
chmod -R 755 .

print_status "Installing backend dependencies..."
cd apps/backend
pip3 install -r requirements.txt
cd ..

print_status "Installing frontend dependencies..."
cd apps/frontend
npm ci

print_status "Cleaning previous build..."
rm -rf .next
rm -rf node_modules/.cache || true

print_status "Creating .next directory with proper permissions..."
mkdir -p .next
chmod 755 .next

print_status "Building frontend application..."
NODE_ENV=production npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# Restore .env files if they were overwritten
print_status "Restoring environment files..."
if [ -f "apps/frontend/.env.production.backup" ]; then
    cp apps/frontend/.env.production.backup apps/frontend/.env.production
    rm apps/frontend/.env.production.backup
    print_success "Restored frontend .env.production"
fi

if [ -f "apps/backend/.env.production.backup" ]; then
    cp apps/backend/.env.production.backup apps/backend/.env.production
    rm apps/backend/.env.production.backup
    print_success "Restored backend .env.production"
fi

if [ -f ".env.local.backup" ]; then
    cp .env.local.backup .env.local
    rm .env.local.backup
    print_success "Restored root .env.local"
fi

print_status "Starting PM2 services..."
pm2 start ecosystem.config.js
pm2 save

print_success "Deployment completed successfully!"

print_status "Current PM2 status:"
pm2 list

print_status "Checking application health..."
sleep 5

# Check if services are running
if pm2 list | grep -q "online"; then
    print_success "Services are running successfully"
    
    # Test endpoints
    print_status "Testing endpoints..."
    
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend is responding"
    else
        print_warning "Frontend might not be responding yet"
    fi
    
    if curl -f http://localhost:8000/health >/dev/null 2>&1; then
        print_success "Backend is responding"
    else
        print_warning "Backend might not be responding yet"
    fi
    
else
    print_error "Some services failed to start"
    pm2 logs --lines 20
    exit 1
fi

print_success "🎉 Deployment completed successfully!"
echo ""
echo "Your application is now live:"
echo "• Frontend: https://kraftey.com"
echo "• Backend API: https://staticapi.kraftey.com"
echo ""
echo "To monitor logs: pm2 logs"
echo "To check status: pm2 list"
