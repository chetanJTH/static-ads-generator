#!/bin/bash

echo "🔍 Backend Debug Script"
echo "======================"

# Check Python version
echo "1. Python version:"
python3 --version
python3.11 --version 2>/dev/null || echo "Python 3.11 not found"

# Check if virtual environment exists
echo ""
echo "2. Virtual environment:"
if [ -d "/root/static-ads-generator/apps/api/venv" ]; then
    echo "✅ Virtual environment exists"
    echo "Python in venv:"
    /root/static-ads-generator/apps/api/venv/bin/python --version
else
    echo "❌ Virtual environment not found"
fi

# Check PM2 status
echo ""
echo "3. PM2 status:"
pm2 status

# Check if backend process is running
echo ""
echo "4. Backend process:"
if pm2 list | grep -q "static-ads-backend.*online"; then
    echo "✅ Backend is online"
else
    echo "❌ Backend is not online"
fi

# Check port 8000
echo ""
echo "5. Port 8000 status:"
netstat -tlnp | grep :8000 || echo "Port 8000 not listening"

# Check backend logs
echo ""
echo "6. Recent backend logs:"
pm2 logs static-ads-backend --lines 10

# Test local connection
echo ""
echo "7. Local connection test:"
curl -f http://localhost:8000/health 2>/dev/null && echo "✅ Local health check passed" || echo "❌ Local health check failed"

echo ""
echo "Debug complete!"
