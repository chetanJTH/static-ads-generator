#!/bin/bash

# Ubuntu Server Deployment Script for Static Ads Generator API
# Run this script on your Ubuntu server

set -e

echo "🚀 Deploying Static Ads Generator API on Ubuntu Server"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="static-ads-generator-backend"
APP_DIR="/var/www/$APP_NAME"
SERVICE_USER="www-data"
DOMAIN="staticapi.kraftey.com"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_status "Starting deployment process..."

# Update system packages
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y python3 python3-pip python3-venv nginx apache2 apache2-utils \
    curl wget git build-essential libgl1-mesa-glx libglib2.0-0 libsm6 \
    libxext6 libxrender-dev libgomp1

# Install Node.js and PM2
print_status "Installing Node.js and PM2..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g pm2

# Create application directory
print_status "Creating application directory..."
mkdir -p $APP_DIR
mkdir -p /var/log/pm2
mkdir -p $APP_DIR/logs
mkdir -p $APP_DIR/uploads

# Set permissions
chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR
chown -R $SERVICE_USER:$SERVICE_USER /var/log/pm2

# Copy application files (assuming they're in current directory)
print_status "Copying application files..."
cp -r . $APP_DIR/
chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR

# Create virtual environment
print_status "Creating Python virtual environment..."
cd $APP_DIR
sudo -u $SERVICE_USER python3 -m venv venv
sudo -u $SERVICE_USER ./venv/bin/pip install --upgrade pip

# Install Python dependencies
print_status "Installing Python dependencies..."
sudo -u $SERVICE_USER ./venv/bin/pip install -r requirements.txt

# Create environment file
print_status "Creating environment file..."
if [ ! -f $APP_DIR/.env ]; then
    cp $APP_DIR/env.production $APP_DIR/.env
    print_warning "Please update $APP_DIR/.env with your actual API keys and configuration"
fi

# Configure Apache2
print_status "Configuring Apache2..."
a2enmod ssl
a2enmod headers
a2enmod rewrite
a2enmod proxy
a2enmod proxy_http

# Copy Apache configuration
cp $APP_DIR/apache-staticapi.conf /etc/apache2/sites-available/
a2ensite staticapi

# Create SSL certificate directory
mkdir -p /etc/ssl/certs /etc/ssl/private

print_warning "SSL certificates not found. Please add your SSL certificates:"
print_warning "- /etc/ssl/certs/staticapi.kraftey.com.crt"
print_warning "- /etc/ssl/private/staticapi.kraftey.com.key"
print_warning "- /etc/ssl/certs/staticapi.kraftey.com.chain.crt"

# Configure PM2
print_status "Configuring PM2..."
sudo -u $SERVICE_USER pm2 startup systemd -u $SERVICE_USER --hp /var/www
sudo -u $SERVICE_USER pm2 install pm2-logrotate

# Start the application with PM2
print_status "Starting application with PM2..."
cd $APP_DIR
sudo -u $SERVICE_USER pm2 start ecosystem.config.js --env production

# Save PM2 configuration
sudo -u $SERVICE_USER pm2 save

# Test Apache configuration
print_status "Testing Apache configuration..."
apache2ctl configtest

# Start and enable services
print_status "Starting and enabling services..."
systemctl start apache2
systemctl enable apache2
systemctl restart apache2

# Configure firewall
print_status "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Health check
print_status "Performing health check..."
sleep 10

if curl -f http://localhost:8000/health; then
    print_status "✅ Application is running successfully!"
    print_status "🌐 API URL: http://$DOMAIN"
    print_status "📊 PM2 Status:"
    sudo -u $SERVICE_USER pm2 status
else
    print_error "❌ Health check failed!"
    print_error "📋 Checking PM2 logs..."
    sudo -u $SERVICE_USER pm2 logs $APP_NAME --lines 20
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_status "📝 Next steps:"
print_status "1. Update $APP_DIR/.env with your actual API keys"
print_status "2. Add SSL certificates to /etc/ssl/"
print_status "3. Configure your domain DNS to point to this server"
print_status "4. Test the API: curl https://$DOMAIN/health"
