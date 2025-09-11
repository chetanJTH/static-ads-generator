#!/bin/bash

# SSL Setup Script for staticapi.kraftey.com
# This script sets up SSL certificates using Let's Encrypt

echo "🔐 Setting up SSL for staticapi.kraftey.com..."

# Update system packages
apt-get update

# Install Certbot and Nginx plugin
apt-get install -y certbot python3-certbot-nginx

# Stop any existing Nginx
systemctl stop nginx 2>/dev/null || true

# Create basic Nginx configuration for the backend
cat > /etc/nginx/sites-available/staticapi.kraftey.com << 'EOF'
server {
    listen 80;
    server_name staticapi.kraftey.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/staticapi.kraftey.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Start Nginx
    systemctl start nginx
    systemctl enable nginx
    
    echo "🔐 Obtaining SSL certificate from Let's Encrypt..."
    
    # Get SSL certificate
    certbot --nginx -d staticapi.kraftey.com --non-interactive --agree-tos --email admin@kraftey.com
    
    if [ $? -eq 0 ]; then
        echo "✅ SSL certificate obtained successfully!"
        
        # Test SSL renewal
        certbot renew --dry-run
        
        # Set up automatic renewal
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
        
        echo "🎉 SSL setup complete!"
        echo "🌐 Your backend is now accessible at: https://staticapi.kraftey.com"
        
        # Show certificate info
        echo "📋 Certificate information:"
        certbot certificates
        
    else
        echo "❌ Failed to obtain SSL certificate"
        echo "Please check:"
        echo "1. Domain staticapi.kraftey.com points to this server"
        echo "2. Port 80 is accessible from the internet"
        echo "3. No firewall is blocking the connection"
        exit 1
    fi
else
    echo "❌ Nginx configuration is invalid"
    exit 1
fi
