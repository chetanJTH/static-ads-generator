#!/bin/bash

# 🔐 Authentication Log Monitor
# Run this script to monitor backend logs during admin login testing

echo "========================================"
echo "🔐 AUTHENTICATION LOG MONITOR"
echo "========================================"
echo "Date: $(date)"
echo "Monitoring backend logs for authentication attempts..."
echo "========================================"
echo

# Function to check if PM2 is available
if command -v pm2 >/dev/null 2>&1; then
    echo "✅ PM2 detected - monitoring PM2 logs"
    echo "Press Ctrl+C to stop monitoring"
    echo "========================================"
    echo
    
    # Monitor backend logs with filtering for auth-related messages
    pm2 logs static-ads-backend --lines 0 -f | grep -i -E "(auth|login|signin|error|exception|traceback|failed|success)"
else
    echo "❌ PM2 not found - checking alternative log locations"
    echo "========================================"
    echo
    
    # Check for common log locations
    if [ -f "/var/log/static-ads-backend.log" ]; then
        echo "📋 Monitoring /var/log/static-ads-backend.log"
        tail -f /var/log/static-ads-backend.log | grep -i -E "(auth|login|signin|error|exception|traceback|failed|success)"
    elif [ -f "/opt/hosting/static-ads-generator/logs/backend.log" ]; then
        echo "📋 Monitoring /opt/hosting/static-ads-generator/logs/backend.log"
        tail -f /opt/hosting/static-ads-generator/logs/backend.log | grep -i -E "(auth|login|signin|error|exception|traceback|failed|success)"
    else
        echo "❌ No log files found. Checking system logs..."
        echo "📋 Monitoring system logs for Python/backend processes"
        journalctl -f | grep -i -E "(python|uvicorn|fastapi|static-ads|auth|login|signin|error|exception|traceback|failed|success)"
    fi
fi

echo
echo "========================================"
echo "🔍 LOG MONITORING COMPLETE"
echo "========================================"
echo "What to look for during admin login:"
echo "✅ Successful authentication messages"
echo "❌ Database connection errors"
echo "❌ Authentication failures"
echo "❌ CORS errors"
echo "❌ Missing environment variables"
echo "========================================"
