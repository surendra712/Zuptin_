# 🔧 Google OAuth Setup Guide

## 🚨 Current Issue
The error `"Unsupported provider: provider is not enabled"` occurs because Google OAuth is not configured in your Supabase project.

## 📋 Step-by-Step Setup

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Create a new project or select an existing one
   - Note the project name/ID

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Zuptin"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Save and continue

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Zuptin Web Client"
   - Authorized redirect URIs:
     ```
     https://zrlleoiqdojhavohneed.supabase.co/auth/v1/callback
     http://localhost:8082/auth/callback
     ```
   - Click "Create"
   - **SAVE THE CLIENT ID AND CLIENT SECRET**

### Step 2: Supabase Configuration

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `zrlleoiqdojhavohneed`

2. **Enable Google Provider**
   - Go to "Authentication" → "Providers"
   - Find "Google" in the list
   - Toggle it to "Enabled"
   - Enter your Google OAuth credentials:
     - **Client ID**: (from Google Cloud Console)
     - **Client Secret**: (from Google Cloud Console)
   - Click "Save"

### Step 3: Test the Integration

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Test Google Authentication**
   - Go to sign-in page
   - Click "Continue with Google"
   - Should redirect to Google OAuth consent screen

## 🔍 Troubleshooting

### If you still get errors:

1. **Check Redirect URIs**
   - Make sure the redirect URI in Google Cloud Console exactly matches:
   - `https://zrlleoiqdojhavohneed.supabase.co/auth/v1/callback`

2. **Verify Credentials**
   - Double-check Client ID and Secret in Supabase
   - Make sure there are no extra spaces

3. **Check OAuth Consent Screen**
   - Make sure it's published (not in testing mode)
   - Add your email as a test user if in testing mode

## 🎯 Alternative: Disable Google Auth Temporarily

If you want to test other features first, you can temporarily hide the Google button:

```typescript
// In Auth.tsx, comment out the Google button section:
{/* Google Authentication */}
{/* <div className="mt-6">
  ... Google button code ...
</div> */}
```

## ✅ Expected Behavior After Setup

1. **Google Button Works**: Redirects to Google OAuth
2. **User Selection**: User can choose Google account
3. **Automatic Account Creation**: New users get accounts created
4. **Seamless Login**: Existing users are logged in automatically
5. **Redirect to Dashboard**: Users land on the main page after auth

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify all URLs are exactly correct
3. Make sure OAuth consent screen is properly configured
4. Test with a different Google account

The Google OAuth setup requires these external configurations, but once set up, it will work seamlessly!