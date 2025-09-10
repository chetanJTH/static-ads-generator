@echo off
echo ========================================
echo 🚀 DEPLOYMENT MONITORING SCRIPT
echo ========================================
echo.

echo 📋 Checking GitHub Actions Status...
echo.

:menu
echo ========================================
echo 📊 DEPLOYMENT MONITORING MENU
echo ========================================
echo 1. Check GitHub Actions Status
echo 2. Check Server Requirements
echo 3. Test Server Connection
echo 4. Check Server Directory
echo 5. Monitor PM2 Services
echo 6. Test Endpoints
echo 7. Check Logs
echo 8. Full System Check
echo 9. Exit
echo ========================================
set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto github_status
if "%choice%"=="2" goto server_requirements
if "%choice%"=="3" goto test_connection
if "%choice%"=="4" goto check_directory
if "%choice%"=="5" goto pm2_status
if "%choice%"=="6" goto test_endpoints
if "%choice%"=="7" goto check_logs
if "%choice%"=="8" goto full_check
if "%choice%"=="9" goto exit
goto menu

:github_status
echo.
echo 🔍 Checking GitHub Actions Status...
echo.
echo Please check manually:
echo 1. Go to your GitHub repository
echo 2. Click "Actions" tab
echo 3. Look for the latest workflow run
echo 4. Check if it's running, completed, or failed
echo 5. Click on the workflow to see detailed logs
echo.
echo Common issues to look for:
echo - Missing secrets (SERVER_HOST, SERVER_PASSWORD)
echo - SSH connection failures
echo - Missing software on server
echo - Permission issues
echo.
pause
goto menu

:server_requirements
echo.
echo 🔧 Checking Server Requirements...
echo.
echo Run these commands on your server:
echo.
echo # Check all required software
echo echo "=== Server Requirements Check ==="
echo echo "Node.js: $(node --version 2>/dev/null || echo 'NOT INSTALLED')"
echo echo "Python: $(python3 --version 2>/dev/null || echo 'NOT INSTALLED')"
echo echo "PM2: $(pm2 --version 2>/dev/null || echo 'NOT INSTALLED')"
echo echo "Git: $(git --version 2>/dev/null || echo 'NOT INSTALLED')"
echo echo "SSH: $(ssh -V 2>&1 | head -1)"
echo echo "Directory: $(ls -la /opt/hosting/static-ads-generator/ 2>/dev/null || echo 'NOT FOUND')"
echo echo "PM2 Status: $(pm2 list 2>/dev/null || echo 'PM2 NOT RUNNING')"
echo.
pause
goto menu

:test_connection
echo.
echo 🔗 Testing Server Connection...
echo.
echo Run this command to test SSH connection:
echo ssh root@your-server-ip
echo.
echo If connection fails, check:
echo 1. Server IP address is correct
echo 2. SSH service is running
echo 3. Firewall allows port 22
echo 4. Password is correct
echo.
pause
goto menu

:check_directory
echo.
echo 📁 Checking Server Directory...
echo.
echo Run these commands on your server:
echo.
echo # Check if directory exists
echo ls -la /opt/hosting/
echo ls -la /opt/hosting/static-ads-generator/
echo.
echo # Check directory permissions
echo sudo mkdir -p /opt/hosting/static-ads-generator
echo sudo chown -R root:root /opt/hosting/static-ads-generator
echo sudo chmod -R 755 /opt/hosting/static-ads-generator
echo.
echo # Check if files were deployed
echo find /opt/hosting/static-ads-generator/ -name "*.js" -o -name "*.json" -o -name "*.py"
echo.
pause
goto menu

:pm2_status
echo.
echo 🔄 Checking PM2 Services...
echo.
echo Run these commands on your server:
echo.
echo # Check PM2 status
echo pm2 list
echo.
echo # Check specific services
echo pm2 show static-ads-frontend
echo pm2 show static-ads-backend
echo.
echo # Check PM2 logs
echo pm2 logs --lines 50
echo.
echo # Restart services if needed
echo pm2 restart ecosystem.config.js
echo.
pause
goto menu

:test_endpoints
echo.
echo 🌐 Testing Endpoints...
echo.
echo Run these commands on your server:
echo.
echo # Test local endpoints
echo curl http://localhost:3000
echo curl http://localhost:8000/health
echo.
echo # Test public endpoints
echo curl https://kraftey.com
echo curl https://staticapi.kraftey.com/health
echo.
echo # Check if ports are open
echo netstat -tlnp | grep :3000
echo netstat -tlnp | grep :8000
echo.
pause
goto menu

:check_logs
echo.
echo 📋 Checking Logs...
echo.
echo Run these commands on your server:
echo.
echo # Check PM2 logs
echo pm2 logs static-ads-frontend --lines 100
echo pm2 logs static-ads-backend --lines 100
echo.
echo # Check system logs
echo tail -f /var/log/syslog | grep -i error
echo.
echo # Check nginx logs (if using nginx)
echo tail -f /var/log/nginx/error.log
echo.
pause
goto menu

:full_check
echo.
echo 🔍 Running Full System Check...
echo.
echo This will check everything systematically:
echo.
echo 1. GitHub Actions Status
echo 2. Server Requirements
echo 3. Server Connection
echo 4. Directory Structure
echo 5. PM2 Services
echo 6. Endpoints
echo 7. Logs
echo.
echo Run these commands on your server:
echo.
echo # Full system check
echo echo "=== FULL SYSTEM CHECK ==="
echo echo "Date: $(date)"
echo echo "Uptime: $(uptime)"
echo echo "Disk Usage: $(df -h)"
echo echo "Memory Usage: $(free -h)"
echo echo "Node.js: $(node --version 2>/dev/null || echo 'NOT INSTALLED')"
echo echo "Python: $(python3 --version 2>/dev/null || echo 'NOT INSTALLED')"
echo echo "PM2: $(pm2 --version 2>/dev/null || echo 'NOT INSTALLED')"
echo echo "Git: $(git --version 2>/dev/null || echo 'NOT INSTALLED')"
echo echo "SSH: $(ssh -V 2>&1 | head -1)"
echo echo "Directory: $(ls -la /opt/hosting/static-ads-generator/ 2>/dev/null || echo 'NOT FOUND')"
echo echo "PM2 Status: $(pm2 list 2>/dev/null || echo 'PM2 NOT RUNNING')"
echo echo "Ports: $(netstat -tlnp | grep -E ':(3000|8000)' || echo 'PORTS NOT OPEN')"
echo echo "Endpoints: $(curl -s http://localhost:3000 > /dev/null && echo 'Frontend OK' || echo 'Frontend FAILED')"
echo echo "Backend: $(curl -s http://localhost:8000/health > /dev/null && echo 'Backend OK' || echo 'Backend FAILED')"
echo.
pause
goto menu

:exit
echo.
echo 👋 Exiting Deployment Monitor...
echo.
echo If you need help, check:
echo 1. GitHub Actions logs
echo 2. Server requirements
echo 3. PM2 status
echo 4. Endpoint tests
echo.
pause
exit

:error
echo.
echo ❌ Error occurred. Please check the logs and try again.
echo.
pause
goto menu