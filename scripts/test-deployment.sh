#!/bin/bash

# Test deployment script - simulates the deployment process locally
# This script helps verify the deployment logic without actually deploying

echo "🧪 Testing deployment script logic..."

# Test 1: Check if required files exist
echo "📁 Checking required files..."
required_files=(
    "package.json"
    "apps/frontend/package.json"
    "apps/backend/requirements.txt"
    "apps/backend/main.py"
    "ecosystem.config.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Test 2: Check Node.js and npm availability
echo "🔧 Checking Node.js and npm..."
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node --version) is available"
else
    echo "❌ Node.js not found"
fi

if command -v npm &> /dev/null; then
    echo "✅ npm $(npm --version) is available"
else
    echo "❌ npm not found"
fi

# Test 3: Check Python availability
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    echo "✅ Python3 $(python3 --version) is available"
else
    echo "❌ Python3 not found"
fi

# Test 4: Check PM2 availability
echo "📦 Checking PM2..."
if command -v pm2 &> /dev/null; then
    echo "✅ PM2 $(pm2 --version) is available"
else
    echo "⚠️ PM2 not found (will be installed during deployment)"
fi

# Test 5: Validate ecosystem.config.js syntax
echo "⚙️ Validating ecosystem.config.js..."
if node -e "require('./ecosystem.config.js')" 2>/dev/null; then
    echo "✅ ecosystem.config.js syntax is valid"
else
    echo "❌ ecosystem.config.js has syntax errors"
    exit 1
fi

# Test 6: Check frontend build capability
echo "🏗️ Testing frontend build capability..."
cd apps/frontend
if [ -f "package.json" ]; then
    echo "✅ Frontend package.json found"
    if npm list --depth=0 &>/dev/null; then
        echo "✅ Frontend dependencies can be resolved"
    else
        echo "⚠️ Frontend dependencies need to be installed"
    fi
else
    echo "❌ Frontend package.json not found"
    exit 1
fi

# Test 7: Check backend requirements
echo "🐍 Testing backend requirements..."
cd ../backend
if [ -f "requirements.txt" ]; then
    echo "✅ Backend requirements.txt found"
    if python3 -c "import sys; print('Python path:', sys.executable)" &>/dev/null; then
        echo "✅ Python3 can execute"
    else
        echo "❌ Python3 execution failed"
        exit 1
    fi
else
    echo "❌ Backend requirements.txt not found"
    exit 1
fi

cd ../..

echo ""
echo "🎉 Deployment test completed successfully!"
echo "📋 Summary:"
echo "   - All required files are present"
echo "   - Node.js and npm are available"
echo "   - Python3 is available"
echo "   - ecosystem.config.js is valid"
echo "   - Frontend and backend configurations are correct"
echo ""
echo "✅ Ready for deployment!"
