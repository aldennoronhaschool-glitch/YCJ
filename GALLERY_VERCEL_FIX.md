# Gallery Not Showing on Vercel - Fix Guide

## Problem
The gallery section is visible on `localhost:3000` but not on your deployed Vercel website.

## Root Cause
The homepage was trying to fetch gallery data using `process.env.NEXT_PUBLIC_BASE_URL`, which wasn't set on Vercel.

## Solution Applied
✅ Updated `app/page.tsx` to use `VERCEL_URL` environment variable (automatically available on Vercel)

## Required Environment Variables on Vercel

You need to ensure these environment variables are set in your Vercel project:

### 1. ImageKit Credentials (Required for Gallery)
```
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### 2. Supabase Credentials (Already set, but verify)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Gemini API (If using AI features)
```
GEMINI_API_KEY=your_gemini_key
```

## How to Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (YCJ website)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`)
   - **Value**: Your actual value
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Important**: After adding variables, you must **redeploy** your site:
   - Go to **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Select **Redeploy**

## Verification Steps

After redeploying:

1. Visit your live website
2. Check the homepage - the gallery section should now appear
3. If still not showing, check Vercel logs:
   - Go to **Deployments** → Click on latest deployment → **Function Logs**
   - Look for any errors related to ImageKit or gallery

## Local Testing
Your local site should continue working as before. The code now automatically detects:
- **Vercel**: Uses `https://${VERCEL_URL}`
- **Local**: Uses `http://localhost:3000`

## Need Help?
If the gallery still doesn't show after following these steps, check:
1. Are all ImageKit environment variables correctly set?
2. Is the ImageKit account active and accessible?
3. Are there any errors in Vercel function logs?
