# Google OAuth Production Checklist

## 🚨 Critical Issues to Avoid in Production

### 1. **Environment Variables** ✅
Make sure these are set in your production environment:

```bash
# Required for production
NEXTAUTH_URL=https://kraftey.com
NEXTAUTH_SECRET=your-super-secure-secret-here
GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

### 2. **Google Cloud Console Configuration** ✅

#### **OAuth Consent Screen**
- [ ] **Application name**: Set to "Kraftey" (or your production app name)
- [ ] **User support email**: Your production support email
- [ ] **Application homepage**: `https://kraftey.com`
- [ ] **Privacy policy**: `https://kraftey.com/privacy`
- [ ] **Terms of service**: `https://kraftey.com/terms`
- [ ] **Authorized domains**: Add `kraftey.com`

#### **OAuth 2.0 Client ID**
- [ ] **Application type**: Web application
- [ ] **Name**: "Kraftey Production"

**Authorized JavaScript origins**:
```
https://kraftey.com
https://www.kraftey.com
```

**Authorized redirect URIs**:
```
https://kraftey.com/api/auth/callback/google
https://www.kraftey.com/api/auth/callback/google
```

### 3. **Common Production Issues** ⚠️

#### **Issue 1: Wrong NEXTAUTH_URL**
```bash
# ❌ WRONG - Don't use localhost in production
NEXTAUTH_URL=http://localhost:3000

# ✅ CORRECT - Use your production domain
NEXTAUTH_URL=https://kraftey.com
```

#### **Issue 2: Missing Redirect URIs**
Make sure your production domain is added to Google Cloud Console:
- Go to Google Cloud Console → APIs & Services → Credentials
- Edit your OAuth 2.0 Client ID
- Add `https://kraftey.com/api/auth/callback/google` to Authorized redirect URIs

#### **Issue 3: OAuth Consent Screen Not Published**
- Go to OAuth consent screen
- Make sure it's **Published** (not in Testing mode)
- Add your domain to Authorized domains

#### **Issue 4: Environment Variables Not Set**
Check your hosting platform (Vercel, Netlify, etc.):
- [ ] `NEXTAUTH_URL` is set to your production domain
- [ ] `NEXTAUTH_SECRET` is set (generate with `openssl rand -base64 32`)
- [ ] `GOOGLE_CLIENT_ID` is set to production client ID
- [ ] `GOOGLE_CLIENT_SECRET` is set to production client secret

### 4. **Testing in Production** 🧪

#### **Test OAuth Flow**
1. Go to `https://kraftey.com/auth/signin`
2. Click "Sign in with Google"
3. Should redirect to Google OAuth
4. After authorization, should redirect back to your app
5. User should be logged in

#### **Common Error Messages**
- **"redirect_uri_mismatch"**: Check redirect URIs in Google Cloud Console
- **"invalid_client"**: Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- **"access_denied"**: Check OAuth consent screen configuration
- **"unauthorized_client"**: Check authorized JavaScript origins

### 5. **Security Best Practices** 🔒

#### **Environment Variables**
- [ ] Never commit `.env` files to git
- [ ] Use different OAuth credentials for dev/staging/production
- [ ] Rotate secrets regularly
- [ ] Use strong NEXTAUTH_SECRET (32+ characters)

#### **OAuth Configuration**
- [ ] Use HTTPS in production (required by Google)
- [ ] Set proper CORS origins
- [ ] Enable security headers
- [ ] Use secure session configuration

### 6. **Deployment Checklist** 📋

Before deploying to production:

- [ ] **Google Cloud Console**:
  - [ ] OAuth consent screen is published
  - [ ] Production domain added to authorized domains
  - [ ] Redirect URIs include production domain
  - [ ] JavaScript origins include production domain

- [ ] **Environment Variables**:
  - [ ] `NEXTAUTH_URL` set to production domain
  - [ ] `NEXTAUTH_SECRET` is secure and unique
  - [ ] `GOOGLE_CLIENT_ID` is production client ID
  - [ ] `GOOGLE_CLIENT_SECRET` is production client secret

- [ ] **Testing**:
  - [ ] OAuth flow works in production
  - [ ] Users can sign in with Google
  - [ ] Sessions persist correctly
  - [ ] Sign out works properly

### 7. **Troubleshooting** 🔧

#### **If OAuth Still Doesn't Work**

1. **Check browser console** for errors
2. **Check server logs** for authentication errors
3. **Verify environment variables** are set correctly
4. **Test with curl**:
   ```bash
   curl -I https://kraftey.com/api/auth/providers
   ```

#### **Quick Fixes**
- **Clear browser cache** and cookies
- **Check Google Cloud Console** for any pending changes
- **Verify domain ownership** in Google Search Console
- **Test with incognito mode** to avoid cached issues

### 8. **Monitoring** 📊

Set up monitoring for:
- [ ] OAuth success/failure rates
- [ ] Authentication errors
- [ ] Session creation failures
- [ ] Google API quota usage

## 🎯 **Quick Production Setup**

1. **Create production OAuth app** in Google Cloud Console
2. **Set environment variables** in your hosting platform
3. **Test OAuth flow** in production
4. **Monitor for errors** after deployment

## 📞 **Support**

If you encounter issues:
1. Check this checklist first
2. Review Google Cloud Console configuration
3. Check environment variables
4. Test with browser developer tools
5. Check server logs for detailed error messages

---

**Remember**: Google OAuth requires HTTPS in production, so make sure your domain has SSL certificates properly configured!
