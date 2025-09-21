# Production Deployment Fixes

## 🔐 Google OAuth Fix

### Problem
Google Sign-in not working in production because OAuth redirect URIs and client configuration aren't set up for the production domain.

### Solution Steps:

1. **Update Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID
   - Add these to **Authorized redirect URIs**:
     ```
     https://kraftey.com/api/auth/callback/google
     https://www.kraftey.com/api/auth/callback/google
     ```
   - Add these to **Authorized JavaScript origins**:
     ```
     https://kraftey.com
     https://www.kraftey.com
     ```

2. **Update Environment Variables on Server:**
   ```bash
   # SSH into your server
   ssh root@your-server-ip
   cd /opt/hosting/static-ads-generator
   
   # Create/update .env.production file
   nano apps/frontend/.env.production
   ```
   
   Add these variables:
   ```env
   NEXTAUTH_URL=https://kraftey.com
   NEXTAUTH_SECRET=your-super-secret-nextauth-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Restart Services:**
   ```bash
   pm2 restart ecosystem.config.js
   ```

## 📝 Missing Blog Posts Fix

### Problem
Only 3 blog posts showing instead of 6 available blog posts.

### Available Blog Posts:
1. ✅ top-5-free-background-removal-tools-2025
2. ✅ how-to-optimize-images-for-better-seo-rankings  
3. ✅ how-to-edit-images-for-different-social-media-platforms
4. ❓ best-ai-image-editing-tools-2025-comprehensive-guide
5. ❓ how-to-remove-watermarks-from-images-ai-guide-2025
6. ❓ image-quality-enhancement-ai-techniques-2025

### Possible Causes:
1. **Build Issue:** Blog posts not being statically generated
2. **Routing Issue:** Blog post routes not being registered
3. **Data Issue:** Blog metadata not being loaded correctly

### Debug Steps:
1. **Check Build Output:**
   ```bash
   # On server, check if all blog pages were built
   ls -la apps/frontend/.next/server/app/blog/
   ```

2. **Check Blog Index:**
   ```bash
   # Check if BlogPage.tsx is loading all posts
   cat apps/frontend/app/blog/BlogPage.tsx | grep -A 10 -B 10 "posts"
   ```

3. **Manual Test:**
   Try accessing each blog post directly:
   - https://kraftey.com/blog/best-ai-image-editing-tools-2025-comprehensive-guide
   - https://kraftey.com/blog/how-to-remove-watermarks-from-images-ai-guide-2025
   - https://kraftey.com/blog/image-quality-enhancement-ai-techniques-2025

## 🚀 Quick Fix Commands

### For Google OAuth:
```bash
# Update environment variables
echo "NEXTAUTH_URL=https://kraftey.com" >> apps/frontend/.env.production
echo "NEXTAUTH_SECRET=your-secret-here" >> apps/frontend/.env.production
echo "GOOGLE_CLIENT_ID=your-client-id" >> apps/frontend/.env.production
echo "GOOGLE_CLIENT_SECRET=your-client-secret" >> apps/frontend/.env.production

# Restart services
pm2 restart ecosystem.config.js
```

### For Missing Blogs:
```bash
# Rebuild frontend to ensure all routes are generated
cd apps/frontend
rm -rf .next
npm run build
cd ../..
pm2 restart static-ads-frontend
```

## 🔍 Verification Steps

### Test Google OAuth:
1. Go to https://kraftey.com
2. Click "Sign In"
3. Try "Continue with Google"
4. Should redirect to Google and back successfully

### Test Blog Posts:
1. Go to https://kraftey.com/blog
2. Should see all 6 blog posts listed
3. Click on each blog post to verify they load

## 📞 If Issues Persist:

1. **Check Logs:**
   ```bash
   pm2 logs static-ads-frontend --lines 50
   pm2 logs static-ads-backend --lines 50
   ```

2. **Check Environment Variables:**
   ```bash
   pm2 show static-ads-frontend | grep -A 20 "env:"
   ```

3. **Test OAuth Callback:**
   ```bash
   curl -I https://kraftey.com/api/auth/callback/google
   ```
