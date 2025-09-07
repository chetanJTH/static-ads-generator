# PM2 Troubleshooting Guide
## Static Ads Generator API

## 🚨 Common PM2 Issues and Solutions

### Issue 1: SyntaxError: Invalid or unexpected token

**Error:**
```
SyntaxError: Invalid or unexpected token
    at Object.compileFunction (node:vm:360:18)
```

**Cause:** PM2 is trying to parse the ecosystem.config.js as a Node.js application instead of using it to run a Python application.

**Solutions:**

#### Solution 1: Fix PM2 Configuration
```bash
# SSH into your server
ssh user@your-server

# Run the fix script
sudo chmod +x /tmp/fix_pm2_config.sh
sudo /tmp/fix_pm2_config.sh
```

#### Solution 2: Manual Fix
```bash
# Stop all PM2 processes
sudo -u www-data pm2 stop all
sudo -u www-data pm2 delete all

# Update ecosystem.config.js
cd /opt/hosting/kraftey-static-ads-backend
sudo cp ecosystem-python.config.js ecosystem.config.js

# Start with new configuration
sudo -u www-data pm2 start ecosystem.config.js --env production
sudo -u www-data pm2 save
```

#### Solution 3: Use Systemd Instead of PM2
```bash
# Copy systemd service file
sudo cp static-ads-generator.service /etc/systemd/system/

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable static-ads-generator
sudo systemctl start static-ads-generator

# Check status
sudo systemctl status static-ads-generator
```

### Issue 2: Application Not Starting

**Check these:**

1. **Python Virtual Environment:**
```bash
cd /opt/hosting/kraftey-static-ads-backend
ls -la venv/bin/uvicorn
```

2. **Dependencies:**
```bash
sudo -u www-data ./venv/bin/pip list
sudo -u www-data ./venv/bin/pip install -r requirements.txt
```

3. **File Permissions:**
```bash
sudo chown -R www-data:www-data /opt/hosting/kraftey-static-ads-backend
sudo chmod +x /opt/hosting/kraftey-static-ads-backend/venv/bin/uvicorn
```

4. **Environment Variables:**
```bash
sudo -u www-data cat .env
```

### Issue 3: Port Already in Use

**Check what's using port 8000:**
```bash
sudo netstat -tlnp | grep :8000
sudo lsof -i :8000
```

**Kill process if needed:**
```bash
sudo kill -9 <PID>
```

### Issue 4: CORS Errors

**Check CORS configuration:**
```bash
# Test CORS
curl -v -X OPTIONS https://staticapi.kraftey.com/remove-bg/ \
  -H 'Origin: https://kraftey.com' \
  -H 'Access-Control-Request-Method: POST'
```

**Update CORS origins:**
```bash
sudo nano /opt/hosting/kraftey-static-ads-backend/.env
# Make sure CORS_ORIGINS includes your domain
```

## 🔧 Alternative Startup Methods

### Method 1: Direct Python Execution
```bash
cd /opt/hosting/kraftey-static-ads-backend
sudo -u www-data ./venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Method 2: Using Gunicorn
```bash
cd /opt/hosting/kraftey-static-ads-backend
sudo -u www-data ./venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
```

### Method 3: Using start_app.sh Script
```bash
sudo chmod +x /opt/hosting/kraftey-static-ads-backend/start_app.sh
sudo /opt/hosting/kraftey-static-ads-backend/start_app.sh
```

## 📊 Monitoring and Debugging

### PM2 Commands
```bash
# Check status
sudo -u www-data pm2 status

# View logs
sudo -u www-data pm2 logs static-ads-generator-backend

# Monitor
sudo -u www-data pm2 monit

# Restart
sudo -u www-data pm2 restart static-ads-generator-backend

# Stop
sudo -u www-data pm2 stop static-ads-generator-backend
```

### Systemd Commands
```bash
# Check status
sudo systemctl status static-ads-generator

# View logs
sudo journalctl -u static-ads-generator -f

# Restart
sudo systemctl restart static-ads-generator

# Stop
sudo systemctl stop static-ads-generator
```

### Log Locations
```bash
# PM2 logs
/var/log/pm2/static-ads-generator-*.log

# Systemd logs
sudo journalctl -u static-ads-generator

# Apache logs
/var/log/apache2/staticapi_error.log
/var/log/apache2/staticapi_access.log
```

## 🚀 Quick Fix Commands

### Complete Reset
```bash
# Stop everything
sudo -u www-data pm2 stop all
sudo -u www-data pm2 delete all
sudo systemctl stop static-ads-generator || true

# Update application
cd /opt/hosting/kraftey-static-ads-backend
sudo -u www-data git pull
sudo -u www-data ./venv/bin/pip install -r requirements.txt

# Start with PM2
sudo -u www-data pm2 start ecosystem-python.config.js --env production
sudo -u www-data pm2 save
```

### Test API
```bash
# Health check
curl http://localhost:8000/health

# CORS test
curl -v -X OPTIONS https://staticapi.kraftey.com/remove-bg/ \
  -H 'Origin: https://kraftey.com'
```

## 📝 Configuration Files

### ecosystem-python.config.js (Recommended)
```javascript
module.exports = {
  apps: [
    {
      name: 'static-ads-generator-backend',
      script: '/opt/hosting/kraftey-static-ads-backend/venv/bin/uvicorn',
      args: 'main:app --host 127.0.0.1 --port 8000 --workers 4',
      cwd: '/opt/hosting/kraftey-static-ads-backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000,
        ENVIRONMENT: 'production',
        HOST: '127.0.0.1'
      },
      error_file: '/var/log/pm2/static-ads-generator-error.log',
      out_file: '/var/log/pm2/static-ads-generator-out.log',
      time: true
    }
  ]
};
```

### .env (Production)
```bash
ENVIRONMENT=production
PORT=8000
HOST=127.0.0.1
CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com
REPLICATE_API_TOKEN=your_token_here
REMOVE_BG_API_KEY=your_key_here
CLIPDROP_API_KEY=your_key_here
```

## 🆘 Emergency Recovery

If everything fails, use this emergency startup:

```bash
cd /opt/hosting/kraftey-static-ads-backend
sudo -u www-data ./venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

This will start the application directly without PM2 or systemd, useful for debugging.
