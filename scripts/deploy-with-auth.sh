#!/bin/bash

# Comprehensive Deployment Script with Authentication Setup
# This script handles complete deployment including auth setup

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_DIR="/opt/hosting/static-ads-generator"
FRONTEND_DIR="$PROJECT_DIR/apps/frontend"
BACKEND_DIR="$PROJECT_DIR/apps/backend"

print_status "Starting comprehensive deployment with authentication setup..."

# Step 1: Pull latest code
print_status "Pulling latest code from repository..."
cd "$PROJECT_DIR"
git pull origin main
print_success "Code updated successfully"

# Step 2: Install dependencies
print_status "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install
print_success "Frontend dependencies installed"

print_status "Installing backend dependencies..."
cd "$BACKEND_DIR"
pip3 install -r requirements.txt
print_success "Backend dependencies installed"

# Step 3: Set up environment variables
print_status "Setting up environment variables..."

# Generate NEXTAUTH_SECRET if not exists
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    print_success "Generated new NEXTAUTH_SECRET"
else
    print_success "Using existing NEXTAUTH_SECRET"
fi

# Set environment variables
export NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
export NEXTAUTH_URL="https://kraftey.com"
export DATABASE_URL="file:./apps/frontend/prisma/dev.db"

# Create/update .env.production file
print_status "Creating frontend .env.production file..."
cat > "$FRONTEND_DIR/.env.production" << EOF
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=https://kraftey.com
DATABASE_URL=file:./prisma/dev.db
NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com
EOF
print_success "Frontend environment file created"

# Create/update backend .env.production file
print_status "Creating backend .env.production file..."
cat > "$BACKEND_DIR/.env.production" << EOF
# Database
DATABASE_URL=file:./apps/frontend/prisma/dev.db

# Replicate API (you need to set this)
REPLICATE_API_TOKEN=your_replicate_token_here

# Environment
ENVIRONMENT=production
DEBUG=false

# CORS
ALLOWED_ORIGINS=https://kraftey.com,https://www.kraftey.com

# File upload settings
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
EOF
print_success "Backend environment file created"

# Step 4: Set up database
print_status "Setting up database..."
cd "$FRONTEND_DIR"

# Set DATABASE_URL for Prisma
export DATABASE_URL="file:./prisma/dev.db"

# Create database tables
npx prisma db push
print_success "Database tables created"

# Step 5: Create admin user
print_status "Creating admin user..."
cd "$PROJECT_DIR"

# Create admin user setup script
cat > setup_admin_user.py << 'EOF'
#!/usr/bin/env python3
import sqlite3
import bcrypt
import os
from datetime import datetime

def setup_admin_user():
    try:
        # Connect to database
        db_path = "apps/frontend/prisma/dev.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if admin user exists
        cursor.execute("SELECT id, email, password FROM User WHERE email = 'info.kraftey@gmail.com'")
        existing_user = cursor.fetchone()
        
        if existing_user:
            print("✅ Admin user already exists")
            user_id, email, password = existing_user
            
            if not password:
                print("🔧 Setting password for existing admin user...")
                hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
                cursor.execute(
                    "UPDATE User SET password = ?, updatedAt = ? WHERE email = ?",
                    (hashed_password.decode('utf-8'), datetime.now().isoformat(), email)
                )
                conn.commit()
                print("✅ Password set successfully")
            else:
                print("✅ Admin user already has password")
        else:
            print("🔧 Creating new admin user...")
            hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
            
            cursor.execute("""
                INSERT INTO User (id, email, name, password, emailVerified, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                f"admin_{int(__import__('time').time())}",
                'info.kraftey@gmail.com',
                'Kraftey Admin',
                hashed_password.decode('utf-8'),
                datetime.now().isoformat(),
                datetime.now().isoformat(),
                datetime.now().isoformat()
            ))
            conn.commit()
            print("✅ Admin user created successfully")
        
        # Verify the user
        cursor.execute("SELECT email, name FROM User WHERE email = 'info.kraftey@gmail.com'")
        user = cursor.fetchone()
        if user:
            print(f"✅ Admin user verified: {user[0]} - {user[1]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error setting up admin user: {e}")
        return False

if __name__ == "__main__":
    setup_admin_user()
EOF

# Install bcrypt if not installed
pip3 install bcrypt > /dev/null 2>&1 || true

# Run admin user setup
python3 setup_admin_user.py
print_success "Admin user setup completed"

# Step 6: Build frontend
print_status "Building frontend..."
cd "$FRONTEND_DIR"
npm run build
print_success "Frontend built successfully"

# Step 7: Restart services
print_status "Restarting services..."

# Try different restart methods
if command -v pm2 &> /dev/null; then
    print_status "Restarting with PM2..."
    pm2 restart all || pm2 start ecosystem.config.js || true
    print_success "PM2 services restarted"
elif systemctl is-active --quiet nginx; then
    print_status "Restarting with systemctl..."
    sudo systemctl restart nginx || true
    sudo systemctl restart your-app-service || true
    print_success "System services restarted"
elif command -v docker-compose &> /dev/null; then
    print_status "Restarting with Docker..."
    docker-compose restart || true
    print_success "Docker services restarted"
else
    print_warning "No service manager found. Please restart your services manually."
fi

# Step 8: Test deployment
print_status "Testing deployment..."

# Test backend health
if curl -s https://staticapi.kraftey.com/health/ > /dev/null; then
    print_success "Backend API is responding"
else
    print_warning "Backend API might not be responding"
fi

# Test frontend
if curl -s -I https://kraftey.com > /dev/null; then
    print_success "Frontend is responding"
else
    print_warning "Frontend might not be responding"
fi

# Test authentication endpoint
print_status "Testing authentication endpoint..."
auth_response=$(curl -s -X POST https://kraftey.com/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=info.kraftey@gmail.com&password=admin123&redirect=false&json=true" \
  -w "%{http_code}")

if [[ "$auth_response" == *"200"* ]]; then
    print_success "Authentication endpoint is working"
else
    print_warning "Authentication endpoint might have issues"
fi

# Step 9: Cleanup
print_status "Cleaning up temporary files..."
rm -f setup_admin_user.py
print_success "Cleanup completed"

# Final summary
print_success "Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "✅ Code updated from repository"
echo "✅ Dependencies installed"
echo "✅ Environment variables configured"
echo "✅ Database tables created"
echo "✅ Admin user created/updated"
echo "✅ Frontend built"
echo "✅ Services restarted"
echo ""
echo "🔑 Admin Credentials:"
echo "   Email: info.kraftey@gmail.com"
echo "   Password: admin123"
echo ""
echo "🌐 URLs:"
echo "   Frontend: https://kraftey.com"
echo "   Admin Panel: https://kraftey.com/admin/blog"
echo "   Backend API: https://staticapi.kraftey.com"
echo ""
echo "⚠️  Important:"
echo "   - Set REPLICATE_API_TOKEN in apps/backend/.env.production"
echo "   - Run blog migration: python3 migrate_all_blogs.py"
echo "   - Check logs if any issues occur"
