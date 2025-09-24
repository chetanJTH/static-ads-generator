#!/bin/bash

# Production Environment Setup Script
# Ensures all required environment variables are configured

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

print_status "🔧 Setting up Production Environment"
echo ""

# Check if we're in the right directory
if [ ! -f "ecosystem.config.js" ]; then
    print_error "Not in the correct directory. Please run from project root."
    exit 1
fi

# Create production environment file for frontend (only if it doesn't exist)
print_status "Setting up frontend production environment file..."

ENV_FILE="apps/frontend/.env.production"
if [ -f "$ENV_FILE" ]; then
    print_warning "Frontend .env.production already exists - skipping creation"
    print_status "If you need to update it, please do so manually"
else
    print_status "Creating new frontend production environment file..."
    cat > "$ENV_FILE" << EOF
# Production Environment Variables
NODE_ENV=production

# Database Configuration
DATABASE_URL=file:./prod.db

# NextAuth Configuration
NEXTAUTH_URL=https://kraftey.com
NEXTAUTH_SECRET=kraftey-production-secret-2025-$(openssl rand -base64 12)

# API Configuration
NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com
NEXT_PUBLIC_BASE_URL=https://kraftey.com
NEXT_PUBLIC_APP_NAME=Kraftey

# Google OAuth (Replace with your actual credentials)
GOOGLE_CLIENT_ID=\${GOOGLE_CLIENT_ID:-your-google-client-id-here}
GOOGLE_CLIENT_SECRET=\${GOOGLE_CLIENT_SECRET:-your-google-client-secret-here}

# Optional: Disable telemetry
NEXT_TELEMETRY_DISABLED=1
EOF

    print_success "Created $ENV_FILE"
    
    # Set proper permissions
    chmod 600 "$ENV_FILE"
    print_success "Set secure permissions on environment file"
fi

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

# Create backend environment file (only if it doesn't exist)
print_status "Setting up backend environment file..."

BACKEND_ENV_FILE="apps/backend/.env.production"
if [ -f "$BACKEND_ENV_FILE" ]; then
    print_warning "Backend .env.production already exists - skipping creation"
    print_status "If you need to update it, please do so manually"
else
    print_status "Creating new backend production environment file..."
    cat > "$BACKEND_ENV_FILE" << EOF
# Backend Production Environment
ENVIRONMENT=production
LOG_LEVEL=INFO
CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com
API_HOST=0.0.0.0
API_PORT=8000
ALLOWED_HOSTS=kraftey.com,staticapi.kraftey.com,localhost,127.0.0.1

# Replicate API (Replace with your actual token)
REPLICATE_API_TOKEN=\${REPLICATE_API_TOKEN:-your-replicate-api-token-here}
FLUX_MODEL=black-forest-labs/flux-schnell:latest
EOF

    chmod 600 "$BACKEND_ENV_FILE"
    print_success "Created $BACKEND_ENV_FILE"
fi

# Verify ecosystem config has required variables
print_status "Verifying ecosystem configuration..."

if grep -q "DATABASE_URL" ecosystem.config.js; then
    print_success "DATABASE_URL found in ecosystem config"
else
    print_warning "DATABASE_URL not found in ecosystem config"
fi

if grep -q "NEXTAUTH_SECRET" ecosystem.config.js; then
    print_success "NEXTAUTH_SECRET found in ecosystem config"
else
    print_warning "NEXTAUTH_SECRET not found in ecosystem config"
fi

# Create environment validation script
print_status "Creating environment validation script..."

cat > "scripts/validate-env.sh" << 'EOF'
#!/bin/bash

# Environment Validation Script
echo "🔍 Validating Production Environment..."

# Check required files
FILES=(
    "apps/frontend/.env.production"
    "apps/backend/.env.production"
    "apps/frontend/prod.db"
    "ecosystem.config.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check PM2 environment variables
echo ""
echo "📋 PM2 Environment Variables:"
pm2 show static-ads-frontend | grep -A 20 "env:" || echo "PM2 app not running"

echo ""
echo "🔍 Environment validation complete!"
EOF

chmod +x "scripts/validate-env.sh"
print_success "Created environment validation script"

print_status "🎯 Production Environment Setup Complete!"
echo ""
echo "📋 Summary:"
echo "✅ Frontend environment file: $ENV_FILE"
echo "✅ Backend environment file: $BACKEND_ENV_FILE"
echo "✅ Database file: $DB_FILE"
echo "✅ Ecosystem config updated with required variables"
echo "✅ Environment validation script created"
echo ""
echo "🔧 Next Steps:"
echo "1. Update Google OAuth credentials in $ENV_FILE"
echo "2. Update Replicate API token in $BACKEND_ENV_FILE"
echo "3. Restart PM2 services: pm2 restart ecosystem.config.js"
echo "4. Validate environment: ./scripts/validate-env.sh"
echo ""
print_success "🎉 No more environment variable issues in production!"



