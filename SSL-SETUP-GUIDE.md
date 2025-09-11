# SSL Setup Guide for staticapi.kraftey.com

## 🔐 **Option 1: Let's Encrypt (Free SSL) - Recommended**

### **Prerequisites:**
1. Domain `staticapi.kraftey.com` must point to your server IP
2. Port 80 and 443 must be open
3. Backend running on port 8000

### **Step 1: Install Certbot**
```bash
# Update packages
apt-get update

# Install Certbot and Nginx plugin
apt-get install -y certbot python3-certbot-nginx
```

### **Step 2: Configure Nginx**
```bash
# Create Nginx configuration
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
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/staticapi.kraftey.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and start Nginx
nginx -t
systemctl restart nginx
```

### **Step 3: Get SSL Certificate**
```bash
# Obtain SSL certificate
certbot --nginx -d staticapi.kraftey.com --non-interactive --agree-tos --email admin@kraftey.com

# Set up automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

### **Step 4: Test SSL**
```bash
# Test the certificate
curl -I https://staticapi.kraftey.com/health

# Check certificate details
openssl s_client -connect staticapi.kraftey.com:443 -servername staticapi.kraftey.com
```

---

## 🔐 **Option 2: Cloudflare SSL (Easiest)**

### **Steps:**
1. **Add Domain to Cloudflare:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Add `staticapi.kraftey.com` as a new site
   - Update nameservers at your domain registrar

2. **Enable SSL:**
   - Go to SSL/TLS → Overview
   - Set encryption mode to "Full (strict)"
   - Enable "Always Use HTTPS"

3. **Configure Origin Server:**
   - Go to SSL/TLS → Origin Server
   - Create Origin Certificate
   - Install certificate on your server

---

## 🔐 **Option 3: Self-Signed Certificate (Development Only)**

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=staticapi.kraftey.com"

# Configure Nginx with SSL
cat > /etc/nginx/sites-available/staticapi.kraftey.com << 'EOF'
server {
    listen 80;
    server_name staticapi.kraftey.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name staticapi.kraftey.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

---

## 🚀 **Quick Setup (Automated)**

Run the automated script:
```bash
# Make script executable
chmod +x scripts/setup-ssl.sh

# Run the setup
./scripts/setup-ssl.sh
```

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Domain not pointing to server:**
   ```bash
   # Check DNS
   nslookup staticapi.kraftey.com
   dig staticapi.kraftey.com
   ```

2. **Port 80 blocked:**
   ```bash
   # Check if port is open
   netstat -tlnp | grep :80
   ufw status
   ```

3. **Nginx not running:**
   ```bash
   # Check Nginx status
   systemctl status nginx
   nginx -t
   ```

4. **Certificate renewal:**
   ```bash
   # Test renewal
   certbot renew --dry-run
   
   # Manual renewal
   certbot renew
   ```

---

## ✅ **After SSL Setup**

Once SSL is working:

1. **Update Frontend API calls** to use `https://staticapi.kraftey.com`
2. **Test all endpoints:**
   - `https://staticapi.kraftey.com/health`
   - `https://staticapi.kraftey.com/remove-bg`
   - `https://staticapi.kraftey.com/design-card`

3. **Remove proxy routes** from Next.js (optional, since direct HTTPS calls will work)

---

## 🎯 **Recommended Approach**

**Use Let's Encrypt (Option 1)** because:
- ✅ Free
- ✅ Automatic renewal
- ✅ Trusted by all browsers
- ✅ Easy to set up
- ✅ Works with your existing setup
