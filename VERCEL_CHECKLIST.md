# Vercel Deployment Checklist

## ⚠️ Most Common Issue: Missing Environment Variables

**90% of Vercel deployment failures are due to missing environment variables!**

### Required Environment Variables (Add ALL of these in Vercel):

1. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** ⚠️ CRITICAL
   - Get from: https://dashboard.clerk.com → API Keys
   - Format: `pk_test_...` or `pk_live_...`
   - Must be added to ALL environments (Production, Preview, Development)

2. **CLERK_SECRET_KEY** ⚠️ CRITICAL
   - Get from: https://dashboard.clerk.com → API Keys
   - Format: `sk_test_...` or `sk_live_...`

3. **WEBHOOK_SECRET** ⚠️ CRITICAL
   - Get from: Clerk Dashboard → Webhooks → Signing Secret
   - Format: `whsec_...`

4. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://vzlxgaquuusnwptpzryp.supabase.co`

5. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Get from: Supabase Dashboard → Project Settings → API → anon/public key

6. **SUPABASE_SERVICE_ROLE_KEY**
   - Get from: Supabase Dashboard → Project Settings → API → service_role key
   - ⚠️ Keep this secret! Never expose it to the client.

## Step-by-Step Vercel Deployment

### Step 1: Import Project
1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Import from GitHub: `aldennoronhaschool-glitch/YCJ`
4. Click **"Import"**

### Step 2: Configure Project
- **Framework Preset:** Next.js (auto-detected) ✅
- **Root Directory:** `./` (default) ✅
- **Build Command:** `npm run build` (default) ✅
- **Output Directory:** `.next` (default) ✅

### Step 3: Add Environment Variables ⚠️ DO THIS BEFORE DEPLOYING
1. Click **"Environment Variables"** (before clicking Deploy)
2. Add each variable one by one:
   - Click **"Add Another"** for each variable
   - Make sure to select **ALL environments** (Production, Preview, Development)
3. Double-check spelling - one typo will break the build!

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete
3. Check build logs if it fails

## Common Deployment Errors & Solutions

### Error 1: "Missing publishableKey"
**Cause:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` not set
**Solution:** Add it to Vercel environment variables

### Error 2: "Failed to fetch" or Database errors
**Cause:** Missing Supabase environment variables
**Solution:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Error 3: Build timeout
**Cause:** Large build or free tier limits
**Solution:** 
- Check build logs for what's taking time
- Consider upgrading Vercel plan if needed

### Error 4: TypeScript errors
**Cause:** Type errors in code
**Solution:** 
- Run `npm run build` locally first
- Fix any TypeScript errors before deploying

### Error 5: Module not found
**Cause:** Missing dependencies
**Solution:** 
- Make sure `package.json` has all dependencies
- Vercel runs `npm install` automatically

## Quick Test Before Deploying

Run this locally to catch errors early:

```bash
# Test build locally
npm run build

# If build succeeds, you're ready for Vercel!
```

## After Successful Deployment

1. **Update Clerk Webhook:**
   - Go to Clerk Dashboard → Webhooks
   - Update URL to: `https://your-project.vercel.app/api/webhooks/clerk`

2. **Update Clerk Allowed Domains:**
   - Clerk Dashboard → Settings
   - Add your Vercel domain

3. **Test the deployment:**
   - Visit your Vercel URL
   - Test sign in/sign out
   - Test admin routes (if applicable)

## Still Having Issues?

1. **Check Vercel Build Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on failed deployment
   - Read the build logs - they'll tell you exactly what's wrong

2. **Common Mistakes:**
   - ❌ Forgetting to add environment variables
   - ❌ Typo in environment variable name
   - ❌ Using wrong keys (test vs production)
   - ❌ Not selecting "All environments" for variables

3. **Get Help:**
   - Share the specific error message from Vercel build logs
   - Check that all 6 environment variables are set
   - Verify your GitHub repo is connected correctly

