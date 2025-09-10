#!/bin/bash

# 🚀 Server Deployment Monitor Script
# Run this on your server to check deployment status

echo "========================================"
echo "🚀 SERVER DEPLOYMENT MONITOR"
echo "========================================"
echo "Date: $(date)"
echo "Server: $(hostname)"
echo "========================================"
echo

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check service status
check_service() {
    local service_name=$1
    local port=$2
    
    if command_exists pm2; then
        if pm2 list | grep -q "$service_name"; then
            echo "✅ $service_name: RUNNING"
        else
            echo "❌ $service_name: NOT RUNNING"
        fi
    else
        echo "⚠️  PM2: NOT INSTALLED"
    fi
    
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        echo "✅ Port $port: OPEN"
    else
        echo "❌ Port $port: CLOSED"
    fi
}

# Function to test endpoint
test_endpoint() {
    local url=$1
    local name=$2
    
    if curl -s --max-time 10 "$url" >/dev/null 2>&1; then
        echo "✅ $name: ACCESSIBLE"
    else
        echo "❌ $name: NOT ACCESSIBLE"
    fi
}

echo "🔍 SYSTEM REQUIREMENTS CHECK"
echo "----------------------------------------"

# Check Node.js
if command_exists node; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js: NOT INSTALLED"
fi

# Check Python
if command_exists python3; then
    echo "✅ Python: $(python3 --version)"
else
    echo "❌ Python: NOT INSTALLED"
fi

# Check PM2
if command_exists pm2; then
    echo "✅ PM2: $(pm2 --version)"
else
    echo "❌ PM2: NOT INSTALLED"
fi

# Check Git
if command_exists git; then
    echo "✅ Git: $(git --version)"
else
    echo "❌ Git: NOT INSTALLED"
fi

# Check SSH
if command_exists ssh; then
    echo "✅ SSH: $(ssh -V 2>&1 | head -1)"
else
    echo "❌ SSH: NOT INSTALLED"
fi

echo
echo "📁 DIRECTORY STRUCTURE CHECK"
echo "----------------------------------------"

# Check deployment directory
if [ -d "/opt/hosting/static-ads-generator" ]; then
    echo "✅ Deployment directory: EXISTS"
    echo "   Size: $(du -sh /opt/hosting/static-ads-generator 2>/dev/null | cut -f1)"
    echo "   Files: $(find /opt/hosting/static-ads-generator -type f | wc -l)"
    
    # Check apps directory
    if [ -d "/opt/hosting/static-ads-generator/apps" ]; then
        echo "✅ Apps directory: EXISTS"
        if [ -d "/opt/hosting/static-ads-generator/apps/frontend" ]; then
            echo "✅ Frontend directory: EXISTS"
        else
            echo "❌ Frontend directory: MISSING"
        fi
        
        if [ -d "/opt/hosting/static-ads-generator/apps/backend" ]; then
            echo "✅ Backend directory: EXISTS"
        else
            echo "❌ Backend directory: MISSING"
        fi
    else
        echo "❌ Apps directory: MISSING"
    fi
    
    # Check ecosystem config
    if [ -f "/opt/hosting/static-ads-generator/ecosystem.config.js" ]; then
        echo "✅ Ecosystem config: EXISTS"
    else
        echo "❌ Ecosystem config: MISSING"
    fi
else
    echo "❌ Deployment directory: NOT FOUND"
fi

echo
echo "🔧 ENVIRONMENT FILES CHECK"
echo "----------------------------------------"

# Check frontend env file
if [ -f "/opt/hosting/static-ads-generator/apps/frontend/.env.production" ]; then
    echo "✅ Frontend env file: EXISTS"
    echo "   API Base: $(grep NEXT_PUBLIC_API_BASE /opt/hosting/static-ads-generator/apps/frontend/.env.production 2>/dev/null || echo 'NOT SET')"
else
    echo "❌ Frontend env file: MISSING"
fi

# Check backend env file
if [ -f "/opt/hosting/static-ads-generator/apps/backend/.env" ]; then
    echo "✅ Backend env file: EXISTS"
    echo "   Environment: $(grep ENVIRONMENT /opt/hosting/static-ads-generator/apps/backend/.env 2>/dev/null || echo 'NOT SET')"
    echo "   CORS Origins: $(grep CORS_ORIGINS /opt/hosting/static-ads-generator/apps/backend/.env 2>/dev/null || echo 'NOT SET')"
else
    echo "❌ Backend env file: MISSING"
fi

echo
echo "🔄 PM2 SERVICES CHECK"
echo "----------------------------------------"

if command_exists pm2; then
    echo "PM2 Status:"
    pm2 list
    
    echo
    echo "Service Details:"
    check_service "static-ads-frontend" "3000"
    check_service "static-ads-backend" "8000"
else
    echo "❌ PM2: NOT INSTALLED"
fi

echo
echo "🌐 ENDPOINT TESTS"
echo "----------------------------------------"

# Test local endpoints
test_endpoint "http://localhost:3000" "Frontend (Local)"
test_endpoint "http://localhost:8000/health" "Backend Health (Local)"

# Test public endpoints
test_endpoint "https://kraftey.com" "Frontend (Public)"
test_endpoint "https://staticapi.kraftey.com/health" "Backend Health (Public)"

echo
echo "📊 SYSTEM RESOURCES"
echo "----------------------------------------"
echo "Uptime: $(uptime)"
echo "Disk Usage:"
df -h | grep -E "(Filesystem|/dev/)"
echo "Memory Usage:"
free -h

echo
echo "🔍 RECENT LOGS"
echo "----------------------------------------"

if command_exists pm2; then
    echo "PM2 Logs (last 10 lines):"
    pm2 logs --lines 10
else
    echo "PM2 not available for logs"
fi

echo
echo "========================================"
echo "🎯 QUICK FIXES"
echo "========================================"

# Suggest fixes based on issues found
if ! command_exists node; then
    echo "❌ Install Node.js: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
fi

if ! command_exists python3; then
    echo "❌ Install Python: sudo apt-get install -y python3 python3-pip"
fi

if ! command_exists pm2; then
    echo "❌ Install PM2: sudo npm install -g pm2"
fi

if [ ! -d "/opt/hosting/static-ads-generator" ]; then
    echo "❌ Create directory: sudo mkdir -p /opt/hosting/static-ads-generator"
fi

if [ ! -f "/opt/hosting/static-ads-generator/apps/frontend/.env.production" ]; then
    echo "❌ Create frontend env file: cat > /opt/hosting/static-ads-generator/apps/frontend/.env.production << 'EOF'"
    echo "NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com"
    echo "NEXTAUTH_SECRET=your-production-secret-key"
    echo "NEXTAUTH_URL=https://kraftey.com"
    echo "NODE_ENV=production"
    echo "EOF"
fi

if [ ! -f "/opt/hosting/static-ads-generator/apps/backend/.env" ]; then
    echo "❌ Create backend env file: cat > /opt/hosting/static-ads-generator/apps/backend/.env << 'EOF'"
    echo "ENVIRONMENT=production"
    echo "CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com"
    echo "REPLICATE_API_TOKEN=your-replicate-api-token"
    echo "FLUX_MODEL=black-forest-labs/flux-schnell:latest"
    echo "STORAGE_DIR=./uploads"
    echo "LOG_LEVEL=INFO"
    echo "USE_END_TO_END_POSTER=false"
    echo "EOF"
fi

echo
echo "========================================"
echo "✅ Monitoring complete!"
echo "========================================"
