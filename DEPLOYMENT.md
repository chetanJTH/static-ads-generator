# 🚀 Digital Ocean Deployment Guide

## Server Information
- **Server IP**: 139.59.69.68
- **OS**: Ubuntu 20.04
- **Frontend Domain**: kraftey.com
- **Backend Domain**: staticapi.kraftey.com

## 📋 Prerequisites

1. **Domain Setup**: Point your domains to the server IP
   - `kraftey.com` → 139.59.69.68
   - `staticapi.kraftey.com` → 139.59.69.68

2. **GitHub Repository**: Push your code to GitHub

3. **SSH Access**: Ensure you can SSH into your server

## 🛠️ Setup Steps

### Step 1: Initial Server Setup
```bash
# SSH into your server
ssh ubuntu@139.59.69.68

# Clone your repository
git clone https://github.com/your-username/your-repo.git /home/ubuntu/static-ads-generator

# Run initial setup
cd /home/ubuntu/static-ads-generator
chmod +x scripts/*.sh
./scripts/setup-server.sh
```

### Step 2: Configure Environment Variables

**Backend Configuration** (`apps/api/.env`):
```bash
# Copy production environment
cp apps/api/env.production apps/api/.env

# Edit with your actual values
nano apps/api/.env
```

**Frontend Configuration** (`apps/web/.env`):
```bash
# Copy production environment
cp apps/web/env.production apps/web/.env

# Edit with your actual values
nano apps/web/.env
```

### Step 3: Deploy Application
```bash
# Deploy the application
./scripts/deploy.sh
```

### Step 4: Setup SSL Certificates
```bash
# Setup SSL with Let's Encrypt
./scripts/setup-ssl.sh
```

## 🔧 Manual Commands

### PM2 Management
```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Stop services
pm2 stop all
```

### Application Logs
```bash
# Backend logs
tail -f /home/ubuntu/static-ads-generator/logs/backend-combined.log

# Frontend logs
tail -f /home/ubuntu/static-ads-generator/logs/frontend-combined.log
```

## 🔄 Auto-Deployment Setup

### GitHub Actions Setup
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `SERVER_SSH_KEY`: Your private SSH key for server access

### Manual Deployment
```bash
# Pull latest changes and deploy
cd /home/ubuntu/static-ads-generator
git pull origin main
./scripts/deploy.sh
```

## 🌐 Access Your Application

After setup, your application will be available at:
- **Frontend**: https://kraftey.com
- **Backend API**: https://staticapi.kraftey.com
- **API Documentation**: https://staticapi.kraftey.com/docs

## 🔍 Troubleshooting

### Check Service Status
```bash
pm2 status
systemctl status nginx
```

### Check Logs
```bash
pm2 logs
sudo journalctl -u nginx
```

### Restart Services
```bash
pm2 restart all
sudo systemctl restart nginx
```

## 📁 Directory Structure
```
/home/ubuntu/static-ads-generator/
├── apps/
│   ├── api/          # Backend FastAPI
│   └── web/          # Frontend Next.js
├── logs/             # Application logs
├── uploads/          # File uploads
└── scripts/          # Deployment scripts
```

## 🔐 Security Notes

1. **Environment Variables**: Never commit `.env` files to Git
2. **SSL Certificates**: Automatically renewed by Let's Encrypt
3. **Firewall**: Ensure ports 80, 443, 22 are open
4. **Updates**: Regularly update your server packages

## 📞 Support

If you encounter issues:
1. Check the logs in `/home/ubuntu/static-ads-generator/logs/`
2. Verify PM2 status with `pm2 status`
3. Check Nginx status with `sudo systemctl status nginx`



