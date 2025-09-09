#!/bin/bash

# Digital Ocean Server Setup Script
# Server: 139.59.69.68 (Ubuntu 20.04)
# Project: Static Ads Generator

echo "🚀 Setting up Digital Ocean server for Static Ads Generator..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.9 and pip
sudo apt install -y python3.9 python3.9-pip python3.9-venv

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Create application directory
sudo mkdir -p /home/ubuntu/static-ads-generator
sudo mkdir -p /home/ubuntu/static-ads-generator/logs
sudo mkdir -p /home/ubuntu/static-ads-generator/uploads

# Set permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/static-ads-generator

# Install Python dependencies
cd /home/ubuntu/static-ads-generator/apps/api
python3.9 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install Node.js dependencies
cd /home/ubuntu/static-ads-generator/apps/web
npm install

# Build frontend for production
npm run build

echo "✅ Server setup complete!"
echo "📁 Application directory: /home/ubuntu/static-ads-generator"
echo "📝 Next steps:"
echo "   1. Copy your .env files to the respective directories"
echo "   2. Run: ./scripts/deploy.sh"
echo "   3. Run: ./scripts/setup-ssl.sh"



