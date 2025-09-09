#!/bin/bash

echo "🔍 Testing Backend Status..."
echo "================================"

# Test 1: Check if backend is running
echo "1. Checking PM2 status..."
pm2 status | grep static-ads-generator-backend

echo ""
echo "2. Checking if backend is listening on port 8000..."
netstat -tlnp | grep :8000

echo ""
echo "3. Testing health endpoint..."
curl -f https://staticapi.kraftey.com/health || echo "❌ Health endpoint failed"

echo ""
echo "4. Testing API docs..."
curl -f https://staticapi.kraftey.com/docs || echo "❌ API docs failed"

echo ""
echo "5. Checking backend logs (last 10 lines)..."
pm2 logs static-ads-generator-backend --lines 10

echo ""
echo "✅ Backend test complete!"
