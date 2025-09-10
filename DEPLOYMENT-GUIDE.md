# 🚀 Complete Deployment Guide

## 📋 **Pre-Deployment Checklist**

### ✅ **Local Testing (Complete First)**
```bash
# Test frontend
cd apps/frontend
npm run dev

# Test backend (new terminal)
cd apps/backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### ✅ **Verify Services**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/health

## 🧹 **Step 1: Clean Server (Manual)**

### **Manual Commands (Replace with your actual service names)**
```bash
# Stop your existing services (replace with your actual service names)
pm2 stop your-frontend-service-name
pm2 stop your-backend-service-name
pm2 delete your-frontend-service-name
pm2 delete your-backend-service-name

# Remove old directories (replace with your actual paths)
rmdir /s /q C:\path\to\your\frontend\directory
rmdir /s /q C:\path\to\your\backend\directory

# Create new directories
mkdir C:\path\to\your\frontend\directory
mkdir C:\path\to\your\backend\directory
```

### **⚠️ Important**
- Replace service names with your actual PM2 service names
- Replace directory paths with your actual server paths
- Only your project will be affected, other projects remain untouched

## 🚀 **Step 2: Deploy to Server**

### **Manual Deployment (Replace paths with your actual paths)**
```bash
# 1. Build frontend
cd apps\frontend
npm run build

# 2. Install backend dependencies
cd ..\backend
pip install -r requirements.txt

# 3. Copy frontend to server (replace with your actual path)
cd ..\..
xcopy apps\frontend\* C:\path\to\your\frontend\directory\ /E /I /Y

# 4. Copy backend to server (replace with your actual path)
xcopy apps\backend\* C:\path\to\your\backend\directory\ /E /I /Y

# 5. Start services
pm2 start ecosystem.frontend.config.js
pm2 start ecosystem.backend.config.js
```

## 📊 **Step 3: Monitor Deployment**

### **Check Service Status**
```bash
pm2 status
```

### **View Logs**
```bash
pm2 logs
```

### **Test Endpoints**
```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:8000/health

# Test detailed health
curl http://localhost:8000/health/detailed
```

### **Interactive Monitor**
```bash
# Run the monitoring script
scripts\monitor-deployment.bat
```

## 🔧 **PM2 Commands**

### **Service Management**
```bash
# Start services
pm2 start ecosystem.frontend.config.js
pm2 start ecosystem.backend.config.js

# Stop services
pm2 stop all

# Restart services
pm2 restart all

# Delete services
pm2 delete all

# View status
pm2 status

# View logs
pm2 logs

# Monitor in real-time
pm2 monit
```

### **Service-Specific Commands**
```bash
# Frontend only
pm2 start ecosystem.frontend.config.js
pm2 stop frontend
pm2 restart frontend

# Backend only
pm2 start ecosystem.backend.config.js
pm2 stop backend
pm2 restart backend
```

## 🌐 **Production URLs**

### **Frontend**
- **Local**: http://localhost:3000
- **Production**: https://kraftey.com

### **Backend**
- **Local**: http://localhost:8000
- **Production**: https://staticapi.kraftey.com

### **Health Endpoints**
- **Basic**: https://staticapi.kraftey.com/health
- **Detailed**: https://staticapi.kraftey.com/health/detailed
- **Readiness**: https://staticapi.kraftey.com/health/ready

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Frontend Not Loading**
```bash
# Check if frontend is running
pm2 status

# Check frontend logs
pm2 logs frontend

# Restart frontend
pm2 restart frontend
```

#### **2. Backend Not Responding**
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs backend

# Check dependencies
cd C:\opt\static-ads-generator-backend
pip list | findstr psutil

# Restart backend
pm2 restart backend
```

#### **3. CORS Issues**
- Check `apps/backend/.env` file
- Verify `CORS_ORIGINS` includes your domain
- Restart backend after changes

#### **4. Port Conflicts**
```bash
# Check what's using ports
netstat -an | findstr ":3000\|:8000"

# Kill processes if needed
taskkill /f /im node.exe
taskkill /f /im python.exe
```

## 📝 **Environment Variables**

### **Frontend** (`apps/frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=https://kraftey.com
NEXTAUTH_SECRET=your-production-secret
```

### **Backend** (`apps/backend/.env`)
```env
ENVIRONMENT=production
CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com
API_HOST=0.0.0.0
API_PORT=8000
REPLICATE_API_TOKEN=your-token
FLUX_MODEL=black-forest-labs/flux-schnell:latest
```

## 🎯 **Success Criteria**

### ✅ **Deployment is Successful When:**
1. **PM2 Status**: Both services show "online"
2. **Frontend**: Accessible at https://kraftey.com
3. **Backend**: Health endpoint responds at https://staticapi.kraftey.com/health
4. **API Communication**: Frontend can communicate with backend
5. **Background Removal**: Feature works end-to-end

### 📊 **Monitoring Commands**
```bash
# Quick health check
curl https://staticapi.kraftey.com/health

# Detailed system info
curl https://staticapi.kraftey.com/health/detailed

# Check if ready for traffic
curl https://staticapi.kraftey.com/health/ready
```

## 🎉 **Deployment Complete!**

Once all steps are completed successfully, your clean monorepo structure will be deployed and running on the server with proper monitoring and management through PM2.
