# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. "npm: command not found" Error

**Problem**: The deployment fails with `npm: command not found` error.

**Root Cause**: Node.js and npm are not properly installed on the server.

**Solution**: The updated deployment script now includes:
- Proper Node.js installation using NodeSource repository
- Verification that both Node.js and npm are installed
- Error handling if installation fails

**Prevention**: The script now checks for both `node` and `npm` commands before proceeding.

### 2. PM2 Installation Issues

**Problem**: PM2 fails to install or start applications.

**Solution**: The updated script:
- Installs PM2 globally with `npm install -g pm2`
- Verifies PM2 installation
- Updates PM2 to latest version if already installed

### 3. Python Backend Issues

**Problem**: Python backend fails to start.

**Solution**: The script now:
- Installs Python3, pip, and venv
- Verifies Python3 installation
- Uses `python3` explicitly in ecosystem.config.js

### 4. File Permission Issues

**Problem**: PM2 logs or application files have permission issues.

**Solution**: The script runs as root and creates proper directories with correct permissions.

### 5. Port Conflicts

**Problem**: Applications fail to start due to port conflicts.

**Solution**: The script:
- Stops existing PM2 processes before starting new ones
- Uses explicit ports (3000 for frontend, 8000 for backend)
- Includes health checks to verify services are running

## Deployment Process

### Step 1: Pre-deployment Testing

Run the test script locally to verify everything is ready:

```bash
./scripts/test-deployment.sh
```

### Step 2: Manual Deployment (if needed)

If the GitHub Actions deployment fails, you can deploy manually:

1. **Connect to your server**:
   ```bash
   ssh root@your-server-ip
   ```

2. **Install required tools**:
   ```bash
   # Update package lists
   apt-get update
   
   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   
   # Install Python3
   apt-get install -y python3 python3-pip python3-venv
   
   # Install curl for health checks
   apt-get install -y curl
   ```

3. **Deploy your code**:
   ```bash
   # Create deployment directory
   mkdir -p /opt/hosting/static-ads-generator
   
   # Copy your code (from your local machine)
   scp -r . root@your-server-ip:/opt/hosting/static-ads-generator/
   ```

4. **Setup and start applications**:
   ```bash
   cd /opt/hosting/static-ads-generator
   
   # Install frontend dependencies
   cd apps/frontend
   npm ci --production
   
   # Install backend dependencies
   cd ../backend
   pip3 install -r requirements.txt
   
   # Build frontend
   cd ../frontend
   npm run build
   
   # Start with PM2
   cd /opt/hosting/static-ads-generator
   pm2 start ecosystem.config.js
   pm2 save
   ```

### Step 3: Verification

Check if everything is running:

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Test endpoints
curl http://localhost:3000
curl http://localhost:8000/health
```

## Environment Variables

Make sure these environment variables are set in your GitHub Secrets:

- `SERVER_HOST`: Your server IP address
- `SERVER_PASSWORD`: Your server root password
- `NEXTAUTH_SECRET`: Secret for NextAuth (generate a secure random string)
- `REPLICATE_API_TOKEN`: Your Replicate API token (if using AI features)

## Logs and Monitoring

### PM2 Logs
```bash
# View all logs
pm2 logs

# View specific app logs
pm2 logs static-ads-frontend
pm2 logs static-ads-backend

# View error logs only
pm2 logs --err
```

### System Logs
```bash
# Check system resources
htop
df -h
free -h

# Check network connections
netstat -tlnp
```

## Rollback Procedure

If deployment fails, you can rollback:

1. **Stop current processes**:
   ```bash
   pm2 stop all
   pm2 delete all
   ```

2. **Restore from backup** (if you have one):
   ```bash
   # Restore from your backup
   ```

3. **Start previous version**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   ```

## Performance Optimization

### Frontend Optimization
- Use `npm ci --production` for faster, reliable installs
- Build with `npm run build` for optimized production bundle
- Use PM2 cluster mode for multiple instances (if needed)

### Backend Optimization
- Use virtual environments for Python dependencies
- Monitor memory usage with PM2
- Use proper logging levels

## Security Considerations

1. **Use SSH keys instead of passwords** for better security
2. **Set up firewall rules** to only allow necessary ports
3. **Use environment variables** for sensitive data
4. **Regular security updates** for the server
5. **Monitor logs** for suspicious activity

## Support

If you continue to have issues:

1. Check the GitHub Actions logs for detailed error messages
2. Run the test script locally to identify issues
3. Check server logs and PM2 status
4. Verify all environment variables are set correctly
5. Ensure your server has sufficient resources (RAM, disk space)
