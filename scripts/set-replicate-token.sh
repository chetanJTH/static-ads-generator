#!/bin/bash

# Script to set Replicate API token
# Usage: ./set-replicate-token.sh YOUR_REPLICATE_TOKEN

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if token is provided
if [ -z "$1" ]; then
    print_error "Please provide your Replicate API token"
    echo "Usage: $0 YOUR_REPLICATE_TOKEN"
    echo ""
    echo "To get your Replicate API token:"
    echo "1. Go to https://replicate.com/account/api-tokens"
    echo "2. Create a new token"
    echo "3. Copy the token and run this script"
    exit 1
fi

REPLICATE_TOKEN="$1"
BACKEND_ENV_FILE="apps/backend/.env.production"

print_status "Setting Replicate API token..."

# Check if backend .env.production exists
if [ ! -f "$BACKEND_ENV_FILE" ]; then
    print_error "Backend .env.production file not found at $BACKEND_ENV_FILE"
    print_status "Creating backend .env.production file..."
    
    cat > "$BACKEND_ENV_FILE" << EOF
# Database
DATABASE_URL=file:./apps/frontend/prisma/dev.db

# Replicate API
REPLICATE_API_TOKEN=$REPLICATE_TOKEN

# Environment
ENVIRONMENT=production
DEBUG=false

# CORS
ALLOWED_ORIGINS=https://kraftey.com,https://www.kraftey.com

# File upload settings
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
EOF
    print_success "Created backend .env.production file with Replicate token"
else
    # Update existing file
    if grep -q "REPLICATE_API_TOKEN" "$BACKEND_ENV_FILE"; then
        # Update existing token
        sed -i "s/REPLICATE_API_TOKEN=.*/REPLICATE_API_TOKEN=$REPLICATE_TOKEN/" "$BACKEND_ENV_FILE"
        print_success "Updated existing Replicate API token"
    else
        # Add new token
        echo "REPLICATE_API_TOKEN=$REPLICATE_TOKEN" >> "$BACKEND_ENV_FILE"
        print_success "Added Replicate API token to existing file"
    fi
fi

# Set environment variable for current session
export REPLICATE_API_TOKEN="$REPLICATE_TOKEN"
print_success "Set REPLICATE_API_TOKEN environment variable"

# Test the token
print_status "Testing Replicate API token..."
test_response=$(curl -s -w "%{http_code}" -o /dev/null \
  -H "Authorization: Token $REPLICATE_TOKEN" \
  https://api.replicate.com/v1/account)

if [ "$test_response" = "200" ]; then
    print_success "Replicate API token is valid"
else
    print_error "Replicate API token test failed (HTTP $test_response)"
    echo "Please check your token and try again"
    exit 1
fi

print_success "Replicate API token setup completed!"
echo ""
echo "🔧 Next steps:"
echo "1. Restart your backend service"
echo "2. Test background removal functionality"
echo ""
echo "🔄 To restart backend:"
echo "   pm2 restart backend"
echo "   # or"
echo "   sudo systemctl restart your-backend-service"
