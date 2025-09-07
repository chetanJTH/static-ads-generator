# Ubuntu Server Deployment Guide
## Static Ads Generator API

This guide will help you deploy the Static Ads Generator API on an Ubuntu server with Apache2 and PM2.

## Prerequisites

- Ubuntu 20.04+ server
- Root or sudo access
- Domain name pointing to your server
- SSL certificates (Let's Encrypt recommended)

## Quick Deployment

### 1. Upload Files to Server

```bash
# On your local machine, upload files to server
scp -r . user@your-server:/tmp/static-ads-generator-backend/
```

### 2. Run Deployment Script

```bash
# SSH into your server
ssh user@your-server

# Move files to deployment location
sudo mv /tmp/static-ads-generator-backend /var/www/

# Run deployment script
cd /opt/hosting/kraftey-static-ads-backend
sudo chmod +x deploy-ubuntu.sh
sudo ./deploy-ubuntu.sh
```

## Manual Deployment Steps

### 1. System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv nginx apache2 apache2-utils \
    curl wget git build-essential libgl1-mesa-glx libglib2.0-0 libsm6 \
    libxext6 libxrender-dev libgomp1

# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Application Setup

```bash
# Create application directory
sudo mkdir -p /opt/hosting/kraftey-static-ads-backend
sudo mkdir -p /var/log/pm2

# Copy application files
sudo cp -r . /opt/hosting/kraftey-static-ads-backend/

# Set permissions
sudo chown -R www-data:www-data /opt/hosting/kraftey-static-ads-backend
sudo chown -R www-data:www-data /var/log/pm2

# Create virtual environment
cd /opt/hosting/kraftey-static-ads-backend
sudo -u www-data python3 -m venv venv
sudo -u www-data ./venv/bin/pip install --upgrade pip
sudo -u www-data ./venv/bin/pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Create environment file
sudo cp env.production .env

# Edit environment file with your settings
sudo nano .env
```

Update the following in `.env`:
```bash
REPLICATE_API_TOKEN=your_actual_replicate_token
REMOVE_BG_API_KEY=your_actual_remove_bg_key
CLIPDROP_API_KEY=your_actual_clipdrop_key
CORS_ORIGINS=https://kraftey.com,https://www.kraftey.com,https://staticapi.kraftey.com
```

### 4. Apache2 Configuration

```bash
# Enable required modules
sudo a2enmod ssl
sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http

# Copy Apache configuration
sudo cp apache-staticapi.conf /etc/apache2/sites-available/
sudo a2ensite staticapi

# Test configuration
sudo apache2ctl configtest
```

### 5. SSL Certificate Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d staticapi.kraftey.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. PM2 Configuration

```bash
# Setup PM2 startup
sudo -u www-data pm2 startup systemd -u www-data --hp /var/www

# Start application
cd /opt/hosting/kraftey-static-ads-backend
sudo -u www-data pm2 start ecosystem.config.js --env production

# Save PM2 configuration
sudo -u www-data pm2 save
```

### 7. Start Services

```bash
# Start Apache2
sudo systemctl start apache2
sudo systemctl enable apache2

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## Management Commands

Use the management script for easy operations:

```bash
# Make script executable
sudo chmod +x manage.sh

# Start application
sudo ./manage.sh start

# Stop application
sudo ./manage.sh stop

# Restart application
sudo ./manage.sh restart

# Check status
sudo ./manage.sh status

# View logs
sudo ./manage.sh logs

# Update application
sudo ./manage.sh update

# Health check
sudo ./manage.sh health
```

## PM2 Commands

```bash
# Check status
sudo -u www-data pm2 status

# View logs
sudo -u www-data pm2 logs static-ads-generator-backend

# Restart application
sudo -u www-data pm2 restart static-ads-generator-backend

# Stop application
sudo -u www-data pm2 stop static-ads-generator-backend

# Monitor
sudo -u www-data pm2 monit
```

## Apache2 Commands

```bash
# Test configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2

# Check status
sudo systemctl status apache2

# View error logs
sudo tail -f /var/log/apache2/staticapi_error.log

# View access logs
sudo tail -f /var/log/apache2/staticapi_access.log
```

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
sudo -u www-data pm2 logs static-ads-generator-backend

# Check if port is in use
sudo netstat -tlnp | grep :8000

# Check Python dependencies
cd /opt/hosting/kraftey-static-ads-backend
sudo -u www-data ./venv/bin/pip list
```

### Apache2 Issues

```bash
# Check Apache configuration
sudo apache2ctl configtest

# Check Apache error logs
sudo tail -f /var/log/apache2/error.log

# Check if Apache is running
sudo systemctl status apache2
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check certificate files
sudo ls -la /etc/ssl/certs/staticapi.kraftey.com*
sudo ls -la /etc/ssl/private/staticapi.kraftey.com*
```

## Security Considerations

1. **Firewall**: Only open necessary ports (22, 80, 443)
2. **SSL**: Use strong SSL certificates and enable HSTS
3. **Updates**: Keep system and dependencies updated
4. **Monitoring**: Set up log monitoring and alerts
5. **Backups**: Regular backups of application and data

## Monitoring

### Log Locations

- PM2 Logs: `/var/log/pm2/`
- Apache Logs: `/var/log/apache2/`
- Application Logs: `/opt/hosting/kraftey-static-ads-backend/logs/`

### Health Check

```bash
# Test API endpoint
curl -f https://staticapi.kraftey.com/health

# Test from external
curl -f https://staticapi.kraftey.com/
```

## Performance Optimization

1. **PM2 Clustering**: Increase workers in ecosystem.config.js
2. **Apache Caching**: Enable mod_cache for static content
3. **Gzip Compression**: Enable mod_deflate
4. **Database**: Add Redis for caching if needed

## Backup Strategy

```bash
# Create backup script
sudo nano /usr/local/bin/backup-api.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/static-ads-generator-$DATE.tar.gz /opt/hosting/kraftey-static-ads-backend
find /backup -name "static-ads-generator-*.tar.gz" -mtime +7 -delete

# Add to crontab
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-api.sh
```

## Support

For issues and support:
1. Check logs first
2. Verify configuration files
3. Test individual components
4. Check system resources (CPU, memory, disk)
