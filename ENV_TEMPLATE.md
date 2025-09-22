# Complete Environment Configuration Template

## 🔑 **Required API Keys & Credentials**

### **1. Gmail/Email Service:**
- Gmail App Password (for `info.kraftey@gmail.com`)

### **2. Google OAuth:**
- Google Client ID
- Google Client Secret

### **3. Replicate API:**
- Replicate API Token

### **4. Cloudinary:**
- Cloudinary Cloud Name
- Cloudinary API Key
- Cloudinary API Secret

### **5. Remove.bg API:**
- Remove.bg API Key

### **6. Clipdrop API:**
- Clipdrop API Key

## 📝 **Environment File Template**

Create `.env.local` in the root directory with:

```bash
# ===========================================
# FRONTEND CONFIGURATION
# ===========================================

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database Configuration
DATABASE_URL="file:./dev.db"

# App Configuration
NEXT_PUBLIC_APP_NAME="Kraftey"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# ===========================================
# EMAIL SERVICE CONFIGURATION
# ===========================================

# Gmail SMTP Configuration
EMAIL_USER=info.kraftey@gmail.com
EMAIL_PASS=your-16-character-gmail-app-password

# ===========================================
# BACKEND API CONFIGURATION
# ===========================================

# Replicate API (for AI image processing)
REPLICATE_API_TOKEN=your-replicate-api-token

# Remove.bg API (for background removal)
REMOVE_BG_API_KEY=your-remove-bg-api-key

# Clipdrop API (for image processing)
CLIPDROP_API_KEY=your-clipdrop-api-key

# ===========================================
# CLOUDINARY CONFIGURATION
# ===========================================

# Cloudinary (for image storage and processing)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# ===========================================
# PRODUCTION CONFIGURATION
# ===========================================

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://kraftey.com,https://www.kraftey.com

# Production settings
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development

# Security
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,kraftey.com,www.kraftey.com

# Logging
LOG_LEVEL=INFO

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

## 🚀 **How to Get These Keys:**

### **1. Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"

### **2. Google OAuth:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 Client ID
3. Add redirect URIs

### **3. Replicate API:**
1. Go to replicate.com
2. Sign up and get API token

### **4. Cloudinary:**
1. Go to cloudinary.com
2. Sign up and get credentials

### **5. Remove.bg:**
1. Go to remove.bg
2. Sign up and get API key

### **6. Clipdrop:**
1. Go to clipdrop.co
2. Sign up and get API key

## ⚠️ **Important:**
- Replace all `your-*` placeholders with actual values
- Keep these credentials secure
- Use different values for development vs production
