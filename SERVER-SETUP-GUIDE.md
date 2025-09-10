# 🖥️ Manual Server Setup Guide

## 📋 **What You Need to Do on Your Server**

Since GitHub Actions will automatically deploy the monorepo, you need to manually set up the environment files and configurations on your server.

### **Step 1: Wait for GitHub Actions Deployment**

1. **Check GitHub Actions** - Go to your repository's Actions tab
2. **Wait for deployment to complete** - It will deploy to `/opt/hosting/static-ads-generator`
3. **Verify deployment** - Check if the directory exists

### **Step 2: Create Environment Files on Server**

**SSH into your server and run these commands:**

```bash
# Navigate to the deployed monorepo
cd /opt/hosting/static-ads-generator

# Create frontend environment file
cat > apps/frontend/.env.production << 'EOF'
# Production Environment Variables for Frontend
NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com
NEXTAUTH_SECRET=your-production-secret-key-here
NEXTAUTH_URL=https://kraftey.com
NODE_ENV=production
EOF

# Create backend environment file
cat > apps/backend/.env << 'EOF'
# Production Environment Variables for Backend
ENVIRONMENT=production
CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com
REPLICATE_API_TOKEN=your-replicate-api-token-here
FLUX_MODEL=black-forest-labs/flux-schnell:latest
STORAGE_DIR=./uploads
LOG_LEVEL=INFO
USE_END_TO_END_POSTER=false
EOF
```

### **Step 3: Install Dependencies and Build**

```bash
# Install frontend dependencies
cd apps/frontend
npm ci --production

# Build frontend
npm run build

# Install backend dependencies
cd ../backend
pip3 install -r requirements.txt

# Go back to root
cd ../..
```

### **Step 4: Start Services with PM2**

```bash
# Start services using ecosystem config
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status
```

### **Step 5: Verify Deployment**

```bash
# Check if services are running
pm2 list

# Check logs
pm2 logs

# Test endpoints
curl http://localhost:3000
curl http://localhost:8000/health
curl https://kraftey.com
curl https://staticapi.kraftey.com/health
```

## 🔧 **Environment Variables You Need to Set**

### **Frontend (.env.production)**
- `NEXT_PUBLIC_API_BASE=https://staticapi.kraftey.com`
- `NEXTAUTH_SECRET=your-secret-key`
- `NEXTAUTH_URL=https://kraftey.com`

### **Backend (.env)**
- `ENVIRONMENT=production`
- `CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com`
- `REPLICATE_API_TOKEN=your-replicate-token`
- `FLUX_MODEL=black-forest-labs/flux-schnell:latest`

## 🚨 **Important Notes**

1. **Replace placeholder values** with your actual:
   - Replicate API token
   - NextAuth secret key
   - Any other API keys you use

2. **Check your domain configuration**:
   - Frontend: `https://kraftey.com`
   - Backend: `https://staticapi.kraftey.com`

3. **Verify PM2 services**:
   - `static-ads-frontend` (port 3000)
   - `static-ads-backend` (port 8000)

## 🔍 **Troubleshooting**

If something doesn't work:

```bash
# Check PM2 logs
pm2 logs static-ads-frontend
pm2 logs static-ads-backend

# Restart services
pm2 restart ecosystem.config.js

# Check if ports are open
netstat -tlnp | grep :3000
netstat -tlnp | grep :8000
```

## 📊 **Monitoring Commands**

```bash
# Monitor PM2 processes
pm2 monit

# Check system resources
htop

# Check disk space
df -h

# Check memory usage
free -h
```

**Once you complete these steps, your monorepo will be fully deployed and running in production! 🚀**
