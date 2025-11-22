# Vercel Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `aldennoronhaschool-glitch/YCJ`
4. Vercel will auto-detect Next.js

### 2. Configure Project Settings

**Framework Preset:** Next.js (auto-detected)
**Root Directory:** `./` (leave as default)
**Build Command:** `npm run build` (default)
**Output Directory:** `.next` (default)
**Install Command:** `npm install` (default)

### 3. Add Environment Variables ⚠️ CRITICAL

Go to **Project Settings → Environment Variables** and add ALL of these:

#### Required Environment Variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... or pk_live_...
CLERK_SECRET_KEY=sk_test_... or sk_live_...
WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://vzlxgaquuusnwptpzryp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Important Notes:

- ✅ **Add to ALL environments** (Production, Preview, Development)
- ✅ **NEXT_PUBLIC_*** variables are exposed to the browser
- ✅ Make sure to use **production keys** for production deployment
- ✅ Get your keys from:
  - Clerk: https://dashboard.clerk.com → API Keys
  - Supabase: https://supabase.com/dashboard → Project Settings → API

### 4. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Check the build logs for any errors

### 5. Common Issues & Solutions

#### Issue 1: Build Fails with "Missing publishableKey"

**Solution:** Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is added to Vercel environment variables.

#### Issue 2: Build Fails with Database Errors

**Solution:** 
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that your Supabase project is active
- Ensure database tables are created (run `supabase/schema.sql`)

#### Issue 3: Middleware/Proxy Warning

**Status:** ✅ Resolved - The project now uses `proxy.ts` instead of `middleware.ts` per Next.js 16 conventions.

#### Issue 4: Build Timeout

**Solution:** 
- Check if you're using the free tier (may have build time limits)
- Optimize your build (already done with `productionBrowserSourceMaps: false`)

### 6. Post-Deployment Setup

#### Update Clerk Settings:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to your application
3. Go to **"Domains"** or **"Settings"**
4. Add your Vercel domain (e.g., `your-project.vercel.app`)
5. Update **Allowed Redirect URLs** to include:
   - `https://your-project.vercel.app`
   - `https://your-project.vercel.app/api/auth/callback`

#### Update Clerk Webhook:

1. In Clerk Dashboard → **Webhooks**
2. Update webhook URL to: `https://your-project.vercel.app/api/webhooks/clerk`
3. Make sure `WEBHOOK_SECRET` in Vercel matches Clerk's webhook secret

#### Update Supabase (if needed):

1. If you have RLS policies, verify they work in production
2. Check Supabase Storage bucket permissions

### 7. Verify Deployment

1. Visit your Vercel URL
2. Test authentication (sign in/sign out)
3. Test admin routes (if you have admin access)
4. Check browser console for errors

### 8. Custom Domain (Optional)

1. In Vercel Dashboard → **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Clerk and Supabase settings with new domain

## Troubleshooting

### Check Build Logs

If deployment fails:
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the failed deployment
3. Check **"Build Logs"** for specific errors
4. Common errors:
   - Missing environment variables
   - TypeScript errors
   - Import errors
   - Database connection issues

### Test Locally First

Before deploying, test the build locally:
```bash
npm run build
```

If this fails locally, it will fail on Vercel too.

### Environment Variables Checklist

Before deploying, verify you have:
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

## Need Help?

If you're still having issues:
1. Check Vercel build logs for specific error messages
2. Verify all environment variables are set correctly
3. Make sure your GitHub repository is connected
4. Check that your Node.js version is compatible (Vercel uses Node 18+ by default)

