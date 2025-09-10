# 🚀 Deployment Status Checker

## 📋 **Quick Status Check**

### **Step 1: Check GitHub Actions**
1. Go to your GitHub repository
2. Click "Actions" tab
3. Look for the latest workflow run
4. Check status: ✅ Success, ❌ Failed, 🟡 Running

### **Step 2: Run Server Monitor**
```bash
# Copy the monitoring script to your server
scp scripts/server-monitor.sh root@your-server-ip:/tmp/

# SSH into your server
ssh root@your-server-ip

# Make it executable and run
chmod +x /tmp/server-monitor.sh
/tmp/server-monitor.sh
```

### **Step 3: Quick Manual Check**
```bash
# Check if deployment directory exists
ls -la /opt/hosting/static-ads-generator/

# Check if apps directory exists
ls -la /opt/hosting/static-ads-generator/apps/

# Check PM2 status
pm2 list

# Test endpoints
curl http://localhost:3000
curl http://localhost:8000/health
```

## 🔍 **Common Issues & Solutions**

### **Issue 1: Empty Deployment Directory**
**Symptoms:** `/opt/hosting/static-ads-generator/` exists but is empty
**Solution:**
```bash
# Check GitHub Actions logs for errors
# Usually: SSH connection failed, missing secrets, or server requirements not met
```

### **Issue 2: Missing Apps Directory**
**Symptoms:** Directory exists but no `apps/` folder
**Solution:**
```bash
# GitHub Actions deployment failed
# Check GitHub Actions logs
# Usually: Build failed, missing dependencies, or wrong paths
```

### **Issue 3: PM2 Services Not Running**
**Symptoms:** `pm2 list` shows no services
**Solution:**
```bash
# Start services manually
cd /opt/hosting/static-ads-generator
pm2 start ecosystem.config.js
pm2 save
```

### **Issue 4: Environment Files Missing**
**Symptoms:** Services start but fail to connect
**Solution:**
```bash
# Create environment files
cat > apps/frontend/.env.production << 'EOF'
NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://kraftey.com
NODE_ENV=production
EOF

cat > apps/backend/.env << 'EOF'
ENVIRONMENT=production
CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com
REPLICATE_API_TOKEN=your-replicate-api-token
FLUX_MODEL=black-forest-labs/flux-schnell:latest
STORAGE_DIR=./uploads
LOG_LEVEL=INFO
USE_END_TO_END_POSTER=false
EOF
```

## 🚨 **Emergency Deployment**

If GitHub Actions keeps failing, deploy manually:

```bash
# On your local machine
scp -r . root@your-server-ip:/opt/hosting/static-ads-generator/

# On your server
cd /opt/hosting/static-ads-generator
npm install --production
cd apps/frontend && npm run build
cd ../backend && pip3 install -r requirements.txt
cd ../..
pm2 start ecosystem.config.js
pm2 save
```

## 📊 **Monitoring Commands**

```bash
# Monitor PM2 processes
pm2 monit

# Check logs in real-time
pm2 logs --follow

# Check system resources
htop

# Check disk space
df -h

# Check memory usage
free -h
```

## 🎯 **Success Indicators**

Your deployment is successful when:
- ✅ GitHub Actions shows "Success"
- ✅ `/opt/hosting/static-ads-generator/apps/` exists
- ✅ `pm2 list` shows both services running
- ✅ `curl http://localhost:3000` returns HTML
- ✅ `curl http://localhost:8000/health` returns JSON
- ✅ `https://kraftey.com` loads
- ✅ `https://staticapi.kraftey.com/health` returns health status

## 🔧 **Troubleshooting Steps**

1. **Check GitHub Actions logs** - Look for specific error messages
2. **Run server monitor script** - Get comprehensive system status
3. **Check server requirements** - Ensure all software is installed
4. **Verify environment files** - Make sure they exist and have correct values
5. **Test endpoints** - Verify services are responding
6. **Check PM2 logs** - Look for application-specific errors

**Start with the server monitor script - it will give you a complete picture of what's working and what's not!**
