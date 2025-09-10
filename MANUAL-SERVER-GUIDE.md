# 🚀 Manual Server Deployment Guide

## 📋 **Simple Manual Steps**

### **Step 1: Clean Server (Manual Commands)**

**On your server, run these commands one by one:**

```bash
# 1. Stop your existing services
pm2 stop kraftey-static-ads
pm2 stop static-ads-generator-backend

# 2. Delete the services
pm2 delete kraftey-static-ads
pm2 delete static-ads-generator-backend

# 3. Remove old directories (replace with your actual paths)
rmdir /s /q C:\path\to\your\frontend\directory
rmdir /s /q C:\path\to\your\backend\directory

# 4. Create new directories
mkdir C:\path\to\your\frontend\directory
mkdir C:\path\to\your\backend\directory
```

### **Step 2: Deploy New Structure (Manual Commands)**

**On your server, run these commands:**

```bash
# 1. Build frontend
cd apps\frontend
npm run build

# 2. Install backend dependencies
cd ..\backend
pip install -r requirements.txt

# 3. Copy frontend to server
cd ..\..
xcopy apps\frontend\* C:\path\to\your\frontend\directory\ /E /I /Y

# 4. Copy backend to server
xcopy apps\backend\* C:\path\to\your\backend\directory\ /E /I /Y

# 5. Start services with PM2
pm2 start ecosystem.frontend.config.js
pm2 start ecosystem.backend.config.js
```

### **Step 3: Verify Deployment**

```bash
# Check if services are running
pm2 status

# View logs
pm2 logs

# Test endpoints
curl http://localhost:3000
curl http://localhost:8000/health
```

## 🔧 **What You Need to Replace**

### **Service Names:**
- Frontend: `kraftey-static-ads`
- Backend: `static-ads-generator-backend`

### **Directory Paths:**
- Replace `C:\path\to\your\frontend\directory` with your actual frontend path
- Replace `C:\path\to\your\backend\directory` with your actual backend path

## 📝 **Example with Your Actual Service Names**

Using your actual service names `kraftey-static-ads` and `static-ads-generator-backend`:

```bash
# Stop services
pm2 stop kraftey-static-ads
pm2 stop static-ads-generator-backend
pm2 delete kraftey-static-ads
pm2 delete static-ads-generator-backend

# Remove directories (replace with your actual paths)
rmdir /s /q C:\path\to\your\frontend\directory
rmdir /s /q C:\path\to\your\backend\directory

# Create new directories
mkdir C:\path\to\your\frontend\directory
mkdir C:\path\to\your\backend\directory

# Deploy
xcopy apps\frontend\* C:\path\to\your\frontend\directory\ /E /I /Y
xcopy apps\backend\* C:\path\to\your\backend\directory\ /E /I /Y

# Start services
pm2 start ecosystem.frontend.config.js
pm2 start ecosystem.backend.config.js
```

## 🎯 **That's It!**

This manual approach gives you full control over:
- What services to stop
- What directories to clean
- Where to deploy your new structure
- How to start your services

**No scripts, no automation - just simple manual commands you can run step by step.**
