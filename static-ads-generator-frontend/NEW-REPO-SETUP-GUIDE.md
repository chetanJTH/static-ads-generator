# Complete Setup Guide for New GitHub Repository

This guide will help you set up a new GitHub repository with automated CI/CD deployment to Digital Ocean without Docker.

## 🚀 Step 1: Create New GitHub Repository

### 1.1 Create Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `static-ads-generator-frontend`
   - **Description**: `Static Ads Generator Frontend Application`
   - **Visibility**: Private (recommended) or Public
   - **Initialize**: Don't initialize with README, .gitignore, or license
5. Click "Create repository"

### 1.2 Clone and Set Up Local Repository

```bash
# Clone the empty repository
git clone https://github.com/YOUR_USERNAME/static-ads-generator-frontend.git
cd static-ads-generator-frontend

# Copy your existing code to this directory
# (Copy all your current project files here)

# Add all files to git
git add .

# Make initial commit
git commit -m "Initial commit: Add Next.js application"

# Push to GitHub
git push origin main
```

## 🖥️ Step 2: Set Up Digital Ocean Server

### 2.1 Create Digital Ocean Droplet

1. Go to [Digital Ocean](https://digitalocean.com)
2. Create a new droplet:
   - **OS**: Ubuntu 22.04 LTS
   - **Size**: 2GB RAM, 1 CPU (minimum)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH keys (recommended)
   - **Hostname**: `static-ads-frontend`

### 2.2 Connect to Your Server

```bash
ssh root@YOUR_SERVER_IP
# or if you created a user
ssh your_username@YOUR_SERVER_IP
```

### 2.3 Run Server Setup Script

```bash
# On your local machine, copy the setup script
scp scripts/setup-server-no-docker.sh root@YOUR_SERVER_IP:/tmp/

# On your server, make it executable and run
chmod +x /tmp/setup-server-no-docker.sh
/tmp/setup-server-no-docker.sh
```

This script will install:
- Node.js 18
- PM2 (process manager)
- Nginx (reverse proxy)
- Certbot (SSL certificates)
- Configure firewall

## ⚙️ Step 3: Configure Production Environment

### 3.1 Set Up Environment Variables

```bash
# On your server, edit the environment file
nano /opt/static-ads-frontend/.env.production
```

Update these variables with your actual values:

```bash
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_API_BASE=https://your-backend-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL=your-database-url-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application Settings
NEXT_PUBLIC_APP_NAME=Static Ads Generator
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 3.2 Configure Nginx

```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/static-ads-frontend
```

Replace `your-domain.com` with your actual domain:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

### 3.3 Set Up SSL Certificate

```bash
# Install SSL certificate with Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔐 Step 4: Configure GitHub Secrets

### 4.1 Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "CI/CD Deployment"
4. Select these scopes:
   - `repo` (full control)
   - `workflow` (update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 4.2 Add Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Click "New repository secret" and add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DO_HOST` | Your Digital Ocean server IP | `123.456.789.0` |
| `DO_USERNAME` | SSH username | `root` or `ubuntu` |
| `DO_SSH_KEY` | Your private SSH key | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `NEXT_PUBLIC_API_BASE` | Backend API URL | `https://api.yourdomain.com` |
| `NEXTAUTH_URL` | Frontend URL | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | NextAuth secret | `your-secret-key-here` |
| `DATABASE_URL` | Database connection | `postgresql://user:pass@host:port/db` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `your-google-client-secret` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Static Ads Generator` |
| `NEXT_PUBLIC_BASE_URL` | Base URL | `https://yourdomain.com` |

### 4.3 Get Your SSH Key

```bash
# On your local machine, copy your private SSH key
cat ~/.ssh/id_rsa
# or
cat ~/.ssh/id_ed25519

# Copy the entire output including the BEGIN and END lines
```

## 📁 Step 5: Update Project Files

### 5.1 Update Package.json

Replace your current `package.json` with the production version:

```bash
# Copy the production package.json
cp package.production.json package.json
```

### 5.2 Update Next.js Configuration

```bash
# Copy the production next.config.js
cp next.config.production.js next.config.js
```

### 5.3 Update GitHub Actions Workflow

```bash
# Rename the workflow file
mv .github/workflows/deploy-no-docker.yml .github/workflows/deploy.yml
```

## 🚀 Step 6: Deploy Your Application

### 6.1 Push to GitHub

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Add CI/CD configuration and production setup"

# Push to main branch
git push origin main
```

### 6.2 Monitor Deployment

1. Go to your GitHub repository → Actions tab
2. Watch the workflow run
3. Check the logs for any errors

### 6.3 Verify Deployment

1. Visit your domain: `https://your-domain.com`
2. Check health endpoint: `https://your-domain.com/api/health`
3. Test all functionality

## 🔧 Step 7: Post-Deployment Setup

### 7.1 Set Up Database

If you're using a database:

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Navigate to application directory
cd /opt/static-ads-frontend/current

# Run database migrations
npx prisma migrate deploy
```

### 7.2 Configure Domain DNS

1. Go to your domain registrar
2. Add an A record pointing to your Digital Ocean server IP
3. Add a CNAME record for www pointing to your domain

### 7.3 Set Up Monitoring

```bash
# On your server, check application status
pm2 status

# View logs
pm2 logs static-ads-frontend

# Monitor in real-time
pm2 monit
```

## 🛠️ Useful Commands

### Server Management

```bash
# Check application status
sudo systemctl status static-ads-frontend
pm2 status

# Restart application
sudo systemctl restart static-ads-frontend
pm2 restart static-ads-frontend

# View logs
sudo journalctl -u static-ads-frontend -f
pm2 logs static-ads-frontend

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t
```

### Deployment Management

```bash
# Manual deployment (if needed)
cd /opt/static-ads-frontend
./scripts/deploy-no-docker.sh

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep node
```

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**: Check GitHub Actions logs
2. **Deployment fails**: Verify SSH connection and server setup
3. **Application not accessible**: Check Nginx configuration and firewall
4. **SSL issues**: Ensure domain DNS points to your server
5. **Database connection fails**: Verify DATABASE_URL and network access

### Debug Commands

```bash
# Check if application is running
curl http://localhost:3000/api/health

# Check Nginx configuration
sudo nginx -t

# Check firewall status
sudo ufw status

# Check PM2 logs
pm2 logs static-ads-frontend --lines 50

# Check system logs
sudo journalctl -u static-ads-frontend --since "1 hour ago"
```

## 🔒 Security Checklist

- [ ] SSH key authentication enabled
- [ ] Password authentication disabled
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Regular security updates enabled
- [ ] PM2 process manager configured
- [ ] Log rotation enabled

## 📊 Monitoring Setup

### 7.1 Set Up Log Monitoring

```bash
# Install log monitoring tools
sudo apt install htop iotop nethogs

# Set up log rotation
sudo logrotate -f /etc/logrotate.d/static-ads-frontend
```

### 7.2 Set Up Alerts

Consider setting up:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)

## 🎉 Success!

Your application should now be:
- ✅ Automatically deployed on every push to main
- ✅ Running on a production server
- ✅ Accessible via HTTPS
- ✅ Monitored and logged
- ✅ Secure and optimized

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Review server logs
3. Verify all environment variables
4. Ensure domain DNS is configured
5. Check firewall and security settings

---

**Next Steps**: Consider setting up staging environment, automated backups, and performance monitoring for a complete production setup.
