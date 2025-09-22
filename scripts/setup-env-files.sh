#!/bin/bash

# Environment Files Setup Script
# Standardizes all environment files for consistent deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_status "🔧 Setting up standardized environment files..."

# Check if we're in the right directory
if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ Not in project root. Please run from /opt/hosting/static-ads-generator/"
    exit 1
fi

# 1. Backend Environment File (.env - SINGLE FILE)
print_status "Creating backend .env file..."

cat > apps/backend/.env << 'EOF'
# Backend Environment Variables
ENVIRONMENT=production
LOG_LEVEL=INFO
CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com
API_HOST=0.0.0.0
API_PORT=8000

# Cloudinary Configuration (Replace with your actual credentials)
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name-from-dashboard
CLOUDINARY_API_KEY=your-actual-api-key-from-dashboard
CLOUDINARY_API_SECRET=your-actual-api-secret-from-dashboard

# Replicate API (Replace with your actual token)
REPLICATE_API_TOKEN=r8_your-actual-replicate-token-here
FLUX_MODEL=black-forest-labs/flux-schnell:latest

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
STORAGE_DIR=./uploads

# Security
ALLOWED_HOSTS=kraftey.com,www.kraftey.com,staticapi.kraftey.com
RATE_LIMIT_PER_MINUTE=60
EOF

chmod 600 apps/backend/.env
print_success "Backend .env file created"

# 2. Frontend Environment File (.env - SINGLE FILE)
print_status "Creating frontend .env file..."

cat > apps/frontend/.env << 'EOF'
# Frontend Environment Variables
NODE_ENV=production
DATABASE_URL=file:./prod.db

# NextAuth Configuration
NEXTAUTH_URL=https://kraftey.com
NEXTAUTH_SECRET=kraftey-production-secret-2025-change-this

# API Configuration
NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com
NEXT_PUBLIC_BASE_URL=https://kraftey.com
NEXT_PUBLIC_APP_NAME=Kraftey

# Google OAuth (Replace with your actual credentials)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Optional Settings
NEXT_TELEMETRY_DISABLED=1
EOF

chmod 600 apps/frontend/.env
print_success "Frontend .env file created"

# 3. Create database file
print_status "Creating database file..."
touch apps/frontend/prod.db
chmod 666 apps/frontend/prod.db
print_success "Database file created"

# 4. Remove old/conflicting environment files
print_status "Cleaning up old environment files..."

# Remove multiple naming conventions
rm -f apps/backend/.env.production apps/backend/env.production 2>/dev/null || true
rm -f apps/frontend/.env.production apps/frontend/.env.local 2>/dev/null || true

print_success "Old environment files cleaned up"

# 5. Update .gitignore to include .env files
print_status "Updating .gitignore..."

cat >> .gitignore << 'EOF'

# Environment files
.env
.env.local
.env.production
.env.development
apps/*/.env
apps/*/.env.local
apps/*/.env.production
EOF

print_success ".gitignore updated"

print_status "🎯 Environment Setup Complete!"
echo ""
echo "📋 Summary:"
echo "✅ Backend environment: apps/backend/.env"
echo "✅ Frontend environment: apps/frontend/.env" 
echo "✅ Database file: apps/frontend/prod.db"
echo "✅ Old conflicting files removed"
echo "✅ .gitignore updated"
echo ""
echo "🔧 Next Steps:"
echo "1. Edit apps/backend/.env with your actual API credentials"
echo "2. Edit apps/frontend/.env with your actual Google OAuth credentials"  
echo "3. Restart services: pm2 restart ecosystem.config.js"
echo ""
echo "⚠️  IMPORTANT: Replace placeholder values with real credentials!"
echo "   - Cloudinary: Get from cloudinary.com dashboard"
echo "   - Replicate: Get from replicate.com account settings"
echo "   - Google OAuth: Get from Google Cloud Console"

