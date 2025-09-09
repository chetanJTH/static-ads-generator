#!/bin/bash

# SSL Setup Script for Digital Ocean
# Domains: kraftey.com, staticapi.kraftey.com
# Server: 139.59.69.68

echo "🔐 Setting up SSL certificates with Let's Encrypt..."

# Update system
sudo apt update

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Create directories for SSL
sudo mkdir -p /etc/letsencrypt/live/kraftey.com
sudo mkdir -p /etc/letsencrypt/live/staticapi.kraftey.com

# Install Nginx (required for SSL setup)
sudo apt install -y nginx

# Create basic Nginx config for SSL challenge
sudo tee /etc/nginx/sites-available/kraftey.com > /dev/null <<EOF
server {
    listen 80;
    server_name kraftey.com www.kraftey.com;
    
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

sudo tee /etc/nginx/sites-available/staticapi.kraftey.com > /dev/null <<EOF
server {
    listen 80;
    server_name staticapi.kraftey.com;
    
    location / {
        proxy_pass http://localhost:8000;
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

# Enable sites
sudo ln -sf /etc/nginx/sites-available/kraftey.com /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/staticapi.kraftey.com /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "🌐 Obtaining SSL certificates..."

# Get SSL certificates
sudo certbot --nginx -d kraftey.com -d www.kraftey.com --non-interactive --agree-tos --email admin@kraftey.com
sudo certbot --nginx -d staticapi.kraftey.com --non-interactive --agree-tos --email admin@kraftey.com

# Setup auto-renewal
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "✅ SSL setup complete!"
echo "🔗 Your sites are now available at:"
echo "   Frontend: https://kraftey.com"
echo "   Backend:  https://staticapi.kraftey.com"




