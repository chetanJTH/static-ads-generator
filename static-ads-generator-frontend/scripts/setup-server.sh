#!/bin/bash

# Digital Ocean Server Setup Script
# Run this script on your Digital Ocean server to set up the environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Digital Ocean server for deployment...${NC}"

# Update system packages
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Docker
echo -e "${YELLOW}Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}Docker installed successfully!${NC}"
else
    echo -e "${GREEN}Docker is already installed.${NC}"
fi

# Install Docker Compose
echo -e "${YELLOW}Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose installed successfully!${NC}"
else
    echo -e "${GREEN}Docker Compose is already installed.${NC}"
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
cat > /opt/static-ads-frontend/.env.template << EOF
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

# GitHub Container Registry
GITHUB_TOKEN=your-github-token
GITHUB_ACTOR=your-github-username
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
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/static-ads-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Create systemd service for the application
echo -e "${YELLOW}Creating systemd service...${NC}"
sudo tee /etc/systemd/system/static-ads-frontend.service << EOF
[Unit]
Description=Static Ads Frontend
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/static-ads-frontend
ExecStart=/opt/static-ads-frontend/scripts/deploy.sh
User=$USER
Group=$USER

[Install]
WantedBy=multi-user.target
EOF

# Make deploy script executable
chmod +x /opt/static-ads-frontend/scripts/deploy.sh

echo -e "${GREEN}✅ Server setup completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Update /opt/static-ads-frontend/.env.template with your actual values"
echo -e "2. Rename it to .env"
echo -e "3. Update Nginx configuration with your domain"
echo -e "4. Set up SSL certificate with: sudo certbot --nginx -d your-domain.com"
echo -e "5. Configure GitHub secrets in your repository"
echo -e "6. Push to main branch to trigger deployment"
