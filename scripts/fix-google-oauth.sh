#!/bin/bash

# Google OAuth Production Fix Script
# This script configures Google OAuth for production environment

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

# Check if we're in the right directory
if [ ! -f "ecosystem.config.js" ]; then
    print_error "Not in the correct directory. Please run from project root."
    exit 1
fi

print_status "🔐 Configuring Google OAuth for Production"
echo ""

# Check if environment variables are provided
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ] || [ -z "$NEXTAUTH_SECRET" ]; then
    print_warning "Environment variables not provided as arguments."
    echo ""
    echo "Usage: $0"
    echo "Or set environment variables:"
    echo "  export GOOGLE_CLIENT_ID='your-client-id'"
    echo "  export GOOGLE_CLIENT_SECRET='your-client-secret'"  
    echo "  export NEXTAUTH_SECRET='your-secret'"
    echo "  $0"
    echo ""
    
    # Prompt for values if not provided
    if [ -z "$GOOGLE_CLIENT_ID" ]; then
        read -p "Enter Google Client ID: " GOOGLE_CLIENT_ID
    fi
    
    if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
        read -p "Enter Google Client Secret: " GOOGLE_CLIENT_SECRET
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        read -p "Enter NextAuth Secret (or press Enter to generate): " NEXTAUTH_SECRET
        if [ -z "$NEXTAUTH_SECRET" ]; then
            NEXTAUTH_SECRET=$(openssl rand -base64 32)
            print_status "Generated NextAuth secret: $NEXTAUTH_SECRET"
        fi
    fi
fi

# Create production environment file
print_status "Creating production environment file..."

ENV_FILE="apps/frontend/.env.production"

cat > "$ENV_FILE" << EOF
# Production Environment Variables
NODE_ENV=production
NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com
NEXT_PUBLIC_BASE_URL=https://kraftey.com
NEXT_PUBLIC_APP_NAME=Kraftey

# NextAuth Configuration
NEXTAUTH_URL=https://kraftey.com
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Google OAuth
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

# Database
DATABASE_URL=file:./prod.db
EOF

print_success "Environment file created: $ENV_FILE"

# Set proper permissions
chmod 600 "$ENV_FILE"
print_success "Set secure permissions on environment file"

# Update ecosystem config to load environment file
print_status "Updating PM2 ecosystem configuration..."

# Check if env_file is already configured
if ! grep -q "env_file" ecosystem.config.js; then
    # Backup original config
    cp ecosystem.config.js ecosystem.config.js.backup
    
    # Add env_file configuration (this is a simplified approach)
    print_warning "Manual update required for ecosystem.config.js"
    echo "Please add this to your frontend app configuration:"
    echo "  env_file: './apps/frontend/.env.production',"
fi

print_status "Google OAuth Configuration Summary:"
echo "✅ Environment file: $ENV_FILE"
echo "✅ NextAuth URL: https://kraftey.com"
echo "✅ Google Client ID: ${GOOGLE_CLIENT_ID:0:20}..."
echo "✅ NextAuth Secret: [HIDDEN]"
echo ""

print_warning "Next Steps:"
echo "1. Update Google Cloud Console:"
echo "   - Add https://kraftey.com/api/auth/callback/google to redirect URIs"
echo "   - Add https://kraftey.com to authorized origins"
echo ""
echo "2. Restart PM2 services:"
echo "   pm2 restart ecosystem.config.js"
echo ""
echo "3. Test Google OAuth:"
echo "   - Go to https://kraftey.com"
echo "   - Click 'Sign In' → 'Continue with Google'"
echo ""

print_success "🎉 Google OAuth configuration completed!"
