#!/bin/bash

# Digital Ocean Server Setup Script (No Docker)
# Run this script on your Digital Ocean server to set up the environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Digital Ocean server for Node.js deployment...${NC}"

# Update system packages
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo -e "${YELLOW}Installing Node.js 18...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}Node.js installed successfully!${NC}"
    node --version
    npm --version
else
    echo -e "${GREEN}Node.js is already installed.${NC}"
    node --version
fi

# Install PM2 for process management
echo -e "${YELLOW}Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo -e "${GREEN}PM2 installed successfully!${NC}"
else
    echo -e "${GREEN}PM2 is already installed.${NC}"
fi

# Install Nginx (for reverse proxy)
echo -e "${YELLOW}Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo -e "${GREEN}Nginx installed successfully!${NC}"
else
    echo -e "${GREEN}Nginx is already installed.${NC}"
fi

# Install Certbot for SSL certificates
echo -e "${YELLOW}Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    sudo apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}Certbot installed successfully!${NC}"
else
    echo -e "${GREEN}Certbot is already installed.${NC}"
fi

# Create application directory
echo -e "${YELLOW}Creating application directory...${NC}"
sudo mkdir -p /opt/static-ads-frontend
sudo chown $USER:$USER /opt/static-ads-frontend

# Create environment file template
echo -e "${YELLOW}Creating environment file template...${NC}"
cat > /opt/static-ads-frontend/.env.production << EOF
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
EOF

# Create Nginx configuration
echo -e "${YELLOW}Creating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/static-ads-frontend << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/static-ads-frontend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Create systemd service for the application
echo -e "${YELLOW}Creating systemd service...${NC}"
sudo tee /etc/systemd/system/static-ads-frontend.service << EOF
[Unit]
Description=Static Ads Frontend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/static-ads-frontend/current
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/opt/static-ads-frontend/.env.production

[Install]
WantedBy=multi-user.target
EOF

# Create PM2 ecosystem file
echo -e "${YELLOW}Creating PM2 ecosystem file...${NC}"
cat > /opt/static-ads-frontend/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'static-ads-frontend',
    script: 'server.js',
    cwd: '/opt/static-ads-frontend/current',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '/opt/static-ads-frontend/.env.production',
    log_file: '/opt/static-ads-frontend/logs/combined.log',
    out_file: '/opt/static-ads-frontend/logs/out.log',
    error_file: '/opt/static-ads-frontend/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create logs directory
mkdir -p /opt/static-ads-frontend/logs

# Set up log rotation
echo -e "${YELLOW}Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/static-ads-frontend << EOF
/opt/static-ads-frontend/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo -e "${GREEN}✅ Server setup completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Update /opt/static-ads-frontend/.env.production with your actual values"
echo -e "2. Update Nginx configuration with your domain"
echo -e "3. Set up SSL certificate with: sudo certbot --nginx -d your-domain.com"
echo -e "4. Configure GitHub secrets in your repository"
echo -e "5. Push to main branch to trigger deployment"
echo -e ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "• Check application status: sudo systemctl status static-ads-frontend"
echo -e "• View logs: sudo journalctl -u static-ads-frontend -f"
echo -e "• Restart application: sudo systemctl restart static-ads-frontend"
echo -e "• Check PM2 status: pm2 status"
echo -e "• View PM2 logs: pm2 logs static-ads-frontend"
