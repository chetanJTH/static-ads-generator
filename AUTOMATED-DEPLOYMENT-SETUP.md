# 🚀 Automated Deployment Setup Guide

This guide will help you set up **automated deployment** from GitHub to your DigitalOcean server. Every time you push code to the `main` branch, it will automatically deploy to production.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **DigitalOcean Server**: Running Ubuntu 20.04+ with your application
3. **SSH Access**: You can SSH into your server
4. **Domain Setup**: Your domains point to the server

## 🔧 Step 1: Generate SSH Key for GitHub Actions

### On your local machine:

```bash
# Generate a new SSH key specifically for GitHub Actions
ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com" -f ~/.ssh/github_actions_key

# This creates two files:
# ~/.ssh/github_actions_key (private key)
# ~/.ssh/github_actions_key.pub (public key)
```

### Add the public key to your server:

```bash
# Copy the public key to your server
ssh-copy-id -i ~/.ssh/github_actions_key.pub ubuntu@139.59.69.68

# Or manually add it to authorized_keys
cat ~/.ssh/github_actions_key.pub | ssh ubuntu@139.59.69.68 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

## 🔐 Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

### Required Secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SERVER_SSH_KEY` | Contents of `~/.ssh/github_actions_key` | Private SSH key for server access |
| `SERVER_HOST` | `139.59.69.68` | Your DigitalOcean server IP |

### How to get the SSH key content:

```bash
# Display the private key content
cat ~/.ssh/github_actions_key

# Copy the entire output (including -----BEGIN and -----END lines)
```

## 🛠️ Step 3: Server Configuration

### Ensure your server has the required setup:

```bash
# SSH into your server
ssh ubuntu@139.59.69.68

# Navigate to your app directory
cd /home/ubuntu/static-ads-generator

# Make sure the deploy script is executable
chmod +x scripts/deploy.sh

# Test the deploy script manually first
./scripts/deploy.sh
```

### Verify PM2 is installed and configured:

```bash
# Check PM2 status
pm2 status

# If PM2 is not installed:
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

## 🚀 Step 4: Test the Automated Deployment

### Push a test change:

```bash
# Make a small change to test deployment
echo "# Test deployment $(date)" >> README.md

# Commit and push
git add README.md
git commit -m "Test automated deployment"
git push origin main
```

### Monitor the deployment:

1. Go to your GitHub repository
2. Click on **Actions** tab
3. You should see the deployment workflow running
4. Click on the workflow to see detailed logs

## 📊 Step 5: Monitor Your Deployment

### GitHub Actions Dashboard:
- Go to **Actions** tab in your repository
- View deployment history and logs
- See build status and any failures

### Server Monitoring:
```bash
# SSH into your server to check status
ssh ubuntu@139.59.69.68

# Check PM2 status
pm2 status

# View recent logs
pm2 logs --lines 50

# Check application health
curl https://kraftey.com
curl https://staticapi.kraftey.com/health
```

## 🔄 How It Works

### Deployment Flow:
1. **Push to main branch** → Triggers GitHub Actions
2. **Build & Test** → Runs tests and builds the application
3. **Deploy** → SSH into server and runs deployment script
4. **Health Check** → Verifies applications are running
5. **Notification** → Shows deployment status

### What happens during deployment:
1. Pulls latest code from Git
2. Installs/updates dependencies
3. Builds frontend for production
4. Restarts PM2 processes
5. Performs health checks
6. Reports deployment status

## 🛡️ Security Best Practices

### SSH Key Security:
- Use a dedicated SSH key for GitHub Actions
- Never commit private keys to your repository
- Regularly rotate SSH keys
- Use strong passphrases

### Server Security:
- Keep your server updated: `sudo apt update && sudo apt upgrade`
- Use firewall: `sudo ufw enable`
- Monitor logs regularly
- Use environment variables for sensitive data

## 🔧 Troubleshooting

### Common Issues:

#### 1. SSH Connection Failed
```bash
# Test SSH connection manually
ssh -i ~/.ssh/github_actions_key ubuntu@139.59.69.68

# Check if the key is in authorized_keys
ssh ubuntu@139.59.69.68 "cat ~/.ssh/authorized_keys"
```

#### 2. Deployment Script Fails
```bash
# Check script permissions
ls -la scripts/deploy.sh

# Make executable if needed
chmod +x scripts/deploy.sh

# Test script manually
cd /home/ubuntu/static-ads-generator
./scripts/deploy.sh
```

#### 3. PM2 Issues
```bash
# Check PM2 status
pm2 status

# Restart all processes
pm2 restart all

# View logs
pm2 logs
```

#### 4. Build Failures
```bash
# Check Node.js version
node --version

# Check Python version
python3 --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### GitHub Actions Logs:
- Check the **Actions** tab for detailed error logs
- Look for specific error messages in the workflow steps
- Common issues: SSH key problems, missing dependencies, build failures

## 📈 Advanced Configuration

### Environment-Specific Deployments:
You can modify the workflow to deploy to different environments:

```yaml
# In .github/workflows/deploy.yml
on:
  push:
    branches: [ main ]  # Production
  pull_request:
    branches: [ develop ]  # Staging
```

### Slack/Discord Notifications:
Add notification steps to your workflow:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Database Migrations:
Add database migration steps to your deployment:

```yaml
- name: Run Database Migrations
  run: |
    ssh ubuntu@${{ secrets.SERVER_HOST }} << 'EOF'
      cd /home/ubuntu/static-ads-generator
      # Add your migration commands here
    EOF
```

## 🎉 Success!

Once everything is set up, you'll have:

✅ **Automated deployments** on every push to main  
✅ **Health checks** to ensure applications are running  
✅ **Rollback capability** through Git history  
✅ **Deployment logs** in GitHub Actions  
✅ **Zero-downtime deployments** with PM2  

Your deployment workflow is now fully automated! 🚀

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs first
2. SSH into your server and check PM2 status
3. Review the deployment script logs
4. Verify all secrets are correctly configured

---

**Happy Deploying!** 🎊


