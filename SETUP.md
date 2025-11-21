# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes a few minutes)
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the entire contents of `supabase/schema.sql`
5. Click **Run** to execute the SQL
6. Go to **Storage** → Create a new bucket named `uploads`
7. Make the bucket **public** (or configure policies as needed)

### 3. Set Up Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Configure authentication methods:
   - Enable **Email**
   - Enable **Google** (optional)
   - Enable **Apple** (optional)
4. Copy your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)
5. Set up webhook:
   - Go to **Webhooks** in Clerk dashboard
   - Click **Add Endpoint**
   - For local development: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - For production: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`
   - Copy the **Signing Secret** (starts with `whsec_`)

### 4. Create Environment File

Create `.env.local` in the root directory:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Where to find Supabase keys:**
- Go to Supabase Dashboard → **Settings** → **API**
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (keep secret!)

### 5. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Create Your First Admin User

1. Sign up using Clerk on the website
2. Go to Supabase Dashboard → **Table Editor** → `users` table
3. Find your user (by email or Clerk user ID)
4. Change the `role` field from `user` to `admin`
5. Refresh the website - you should now see the "Admin" link in the navbar

### 7. (Optional) Add Seed Data

1. Go to Supabase SQL Editor
2. Copy and paste contents of `supabase/seed.sql`
3. Run the SQL to add sample events, competitions, and announcements

## Testing Webhooks Locally

For local development, use a tool like [ngrok](https://ngrok.com):

```bash
ngrok http 3000
```

Then use the ngrok URL in your Clerk webhook configuration.

## Common Issues

### Images not uploading
- Check that the `uploads` bucket exists in Supabase Storage
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check bucket permissions are set to public

### Admin access not working
- Verify user role is set to `admin` in Supabase `users` table
- Check that you're signed in with the correct Clerk account
- Clear browser cache and cookies

### Database errors
- Make sure you've run the schema.sql file
- Check that all tables exist in Supabase
- Verify RLS policies are set up correctly

## Next Steps

1. Customize the homepage content
2. Add your first event through the admin panel
3. Upload gallery images
4. Create competitions
5. Deploy to Vercel!

