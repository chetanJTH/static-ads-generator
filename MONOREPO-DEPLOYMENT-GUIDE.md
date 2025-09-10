# 🚀 Monorepo Deployment Guide

## 📋 **Deployment Steps**

### **Step 1: Server Cleanup (Already Done)**
✅ You've already created the monorepo directory on your server.

### **Step 2: Copy Monorepo to Server**

**On your local machine, run these commands to copy the entire monorepo:**

```bash
# Copy entire monorepo to server (replace with your server details)
scp -r . root@your-server-ip:/opt/hosting/static-ads-generator/

# Or if using rsync
rsync -avz --exclude node_modules --exclude .git . root@your-server-ip:/opt/hosting/static-ads-generator/
```

### **Step 3: Server Setup Commands**

**On your server, run these commands:**

```bash
# Navigate to the monorepo directory
cd /opt/hosting/static-ads-generator

# Install frontend dependencies
cd apps/frontend
npm install --production

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Go back to root
cd ../..

# Start services with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### **Step 4: Verify Deployment**

```bash
# Check PM2 services
pm2 list

# Check logs
pm2 logs

# Test endpoints
curl http://localhost:3000
curl http://localhost:8000/health
```

## 🔧 **Environment Variables**

Make sure to set up environment variables on your server:

### **Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_BASE=http://your-server-ip:8000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://your-server-ip:3000
```

### **Backend (.env)**
```bash
DATABASE_URL=your-database-url
CORS_ORIGINS=http://your-server-ip:3000,http://localhost:3000
REPLICATE_API_TOKEN=your-replicate-token
FLUX_MODEL=your-flux-model
```

## 📁 **Final Server Structure**

```
/opt/hosting/static-ads-generator/
├── apps/
│   ├── frontend/
│   │   ├── .next/          # Built frontend
│   │   ├── package.json
│   │   └── ...
│   └── backend/
│       ├── main.py
│       ├── requirements.txt
│       └── ...
├── ecosystem.config.js     # PM2 configuration
├── package.json           # Root package.json
└── ...
```

## 🎯 **Benefits of Monorepo Approach**

- ✅ Single deployment unit
- ✅ Consistent with local development
- ✅ Easier to manage and maintain
- ✅ Single PM2 configuration
- ✅ Matches GitHub structure

## 🚨 **Important Notes**

1. **Replace `your-server-ip`** with your actual server IP address
2. **Set up environment variables** on your server
3. **Configure firewall** to allow ports 3000 and 8000
4. **Set up domain/SSL** if needed for production

## 🔄 **Future Deployments**

For future updates, simply:
1. Copy updated code to server
2. Run `pm2 restart all`
3. Or restart specific services: `pm2 restart static-ads-frontend` / `pm2 restart static-ads-backend`
