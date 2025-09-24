#!/bin/bash

# Server Environment Setup Script
# This script helps set up environment files directly on the server
# without overwriting existing configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "🔧 Server Environment Setup"
echo ""

# Check if we're in the right directory
if [ ! -f "ecosystem.config.js" ]; then
    print_error "Not in the correct directory. Please run from project root."
    exit 1
fi

# Function to create .env file if it doesn't exist
create_env_if_missing() {
    local file_path="$1"
    local content="$2"
    local description="$3"
    
    if [ -f "$file_path" ]; then
        print_warning "$description already exists - skipping creation"
        print_status "Current file: $file_path"
        return 0
    fi
    
    print_status "Creating $description..."
    cat > "$file_path" << EOF
$content
EOF
    
    chmod 600 "$file_path"
    print_success "Created $file_path with secure permissions"
}

# Frontend environment
print_status "Setting up frontend environment..."
FRONTEND_ENV_CONTENT='# Frontend Production Environment
NODE_ENV=production

# Database Configuration
DATABASE_URL=file:./prod.db

# NextAuth Configuration
NEXTAUTH_URL=https://kraftey.com
NEXTAUTH_SECRET=CHANGE_THIS_SECRET_IN_PRODUCTION

# API Configuration
NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com
NEXT_PUBLIC_BASE_URL=https://kraftey.com
NEXT_PUBLIC_APP_NAME=Kraftey

# Google OAuth (Update with your actual credentials)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Email Configuration
EMAIL_USER=info.kraftey@gmail.com
EMAIL_PASS=your-app-password-here

# Optional: Disable telemetry
NEXT_TELEMETRY_DISABLED=1'

create_env_if_missing "apps/frontend/.env.production" "$FRONTEND_ENV_CONTENT" "Frontend .env.production"

# Backend environment
print_status "Setting up backend environment..."
BACKEND_ENV_CONTENT='# Backend Production Environment
ENVIRONMENT=production
LOG_LEVEL=INFO
CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com
API_HOST=0.0.0.0
API_PORT=8000
ALLOWED_HOSTS=kraftey.com,staticapi.kraftey.com,localhost,127.0.0.1

# API Keys (Update with your actual tokens)
REPLICATE_API_TOKEN=your-replicate-api-token-here
REMOVE_BG_API_KEY=your-remove-bg-key-here
CLIPDROP_API_KEY=your-clipdrop-key-here

# Cloudinary Configuration (for image upscaler)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Storage Configuration
STORAGE_DIR=/app/uploads
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=/app/uploads

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Security
SECRET_KEY=CHANGE_THIS_SECRET_IN_PRODUCTION'

create_env_if_missing "apps/backend/.env.production" "$BACKEND_ENV_CONTENT" "Backend .env.production"

# Blog automation environment
print_status "Setting up blog automation environment..."
BLOG_ENV_CONTENT='# Blog Automation Configuration
BLOG_TIMEZONE=America/New_York
DAILY_POST_TIME=09:00
AUTO_DEPLOY=true
GIT_AUTO_PUSH=true

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
REPO_OWNER=chetanJTH
REPO_NAME=static-ads-generator

# Notification Settings (optional)
SLACK_WEBHOOK_URL=
EMAIL_NOTIFICATIONS=false'

create_env_if_missing "blog-automation/.env" "$BLOG_ENV_CONTENT" "Blog automation .env"

# Create database file if it doesn't exist
print_status "Setting up database..."
DB_FILE="apps/frontend/prod.db"

if [ ! -f "$DB_FILE" ]; then
    touch "$DB_FILE"
    chmod 666 "$DB_FILE"
    print_success "Created production database file"
else
    print_success "Production database file already exists"
fi

print_status "🎯 Server Environment Setup Complete!"
echo ""
echo "📋 Summary:"
echo "✅ Environment files created (only if they didn't exist)"
echo "✅ Secure permissions set on all .env files"
echo "✅ Database file ready"
echo ""
echo "🔧 Next Steps:"
echo "1. Update API keys and secrets in the .env files"
echo "2. Update Google OAuth credentials"
echo "3. Update email configuration"
echo "4. Restart PM2 services: pm2 restart ecosystem.config.js"
echo ""
echo "📁 Environment files location:"
echo "• Frontend: apps/frontend/.env.production"
echo "• Backend: apps/backend/.env.production"
echo "• Blog Automation: blog-automation/.env"
echo ""
print_success "🎉 Server environment is ready for production!"
