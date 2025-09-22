# Google OAuth Setup Guide

## 🔧 Required Environment Variables

Your authentication system needs these Google OAuth credentials to work:

### 1. Create `.env.local` file in `apps/frontend/`

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-generate-a-random-string
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Credentials
# Get these from Google Cloud Console -> APIs & Services -> Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL="file:./dev.db"

# API Configuration (if needed)
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## 🚀 Google Cloud Console Setup

### Step 1: Create Google OAuth Application

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing one)
3. **Navigate to**: APIs & Services → Credentials
4. **Click**: + CREATE CREDENTIALS → OAuth 2.0 Client IDs
5. **Configure OAuth consent screen** (if first time)

### Step 2: Configure OAuth Consent Screen

- **Application name**: Kraftey (or your app name)
- **User support email**: Your email
- **Application homepage**: https://kraftey.com
- **Privacy policy**: https://kraftey.com/privacy
- **Terms of service**: https://kraftey.com/terms

### Step 3: Create OAuth 2.0 Client ID

**Application type**: Web application
**Name**: Kraftey Auth

**Authorized JavaScript origins**:
```
http://localhost:3000
https://kraftey.com
```

**Authorized redirect URIs**:
```
http://localhost:3000/api/auth/callback/google
https://kraftey.com/api/auth/callback/google
```

### Step 4: Copy Credentials

After creation, Google will show:
- **Client ID**: Copy this to `GOOGLE_CLIENT_ID`
- **Client Secret**: Copy this to `GOOGLE_CLIENT_SECRET`

## 🔐 Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

## 📁 File Structure

```
apps/frontend/
├── .env.local          # ← Create this file (not committed to git)
├── .env.example        # ← Template (committed to git)
└── ...
```

## ✅ Testing

1. **Start your app**: `npm run dev`
2. **Go to**: http://localhost:3000/auth/signin
3. **Click**: "Sign in with Google"
4. **Should redirect** to Google OAuth flow

## 🚨 Important Notes

- **Never commit** `.env.local` to git (it's in .gitignore)
- **Use different credentials** for development and production
- **Update redirect URIs** when deploying to production
- **Keep your Client Secret secure**

## 🌐 Production Deployment

For production, add your domain to:

**Authorized JavaScript origins**:
```
https://your-domain.com
```

**Authorized redirect URIs**:
```
https://your-domain.com/api/auth/callback/google
```

And set environment variables in your hosting platform (Vercel, Netlify, etc.)


