# Step-by-Step Setup Guide for YCJ Website

Follow these steps in order to get your website running.

## Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (Next.js, Clerk, Supabase, etc.)

---

## Step 2: Set Up Supabase Database

### 2.1 Run the Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/vzlxgaquuusnwptpzryp
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/schema-simple.sql` in this project
5. Copy ALL the contents of that file
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. You should see "Success. No rows returned"

### 2.2 Create Storage Bucket

1. In Supabase dashboard, click **Storage** in the left sidebar
2. Click **New bucket**
3. Name it: `uploads`
4. Make it **Public** (toggle the switch)
5. Click **Create bucket**

### 2.3 Get Your Supabase Keys

1. In Supabase dashboard, click **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL**: `https://vzlxgaquuusnwptpzryp.supabase.co` (you already have this!)
   - **anon public** key: Copy this (starts with `eyJhbGc...`)
   - **service_role** key: Copy this (starts with `eyJhbGc...`) - **Keep this secret!**

---

## Step 3: Set Up Clerk Authentication

### 3.1 Create Clerk Account

1. Go to https://clerk.com and sign up/login
2. Click **Create Application**
3. Choose a name (e.g., "YCJ Website")
4. Select authentication methods:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ Apple (optional)
5. Click **Create Application**

### 3.2 Get Clerk Keys

1. In Clerk dashboard, you'll see **API Keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_...` or `pk_live_...`)
   - **Secret key** (starts with `sk_test_...` or `sk_live_...`)

### 3.3 Set Up Webhook (Important!)

1. In Clerk dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. For now, use: `http://localhost:3000/api/webhooks/clerk` (we'll update this later)
4. Select these events:
   - ✅ `user.created`
   - ✅ `user.updated`
5. Click **Create**
6. Copy the **Signing Secret** (starts with `whsec_...`)

---

## Step 4: Create Environment File

1. In your project root folder, create a new file named `.env.local`
2. Copy this template and fill in your actual values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://vzlxgaquuusnwptpzryp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

**Replace:**
- `pk_test_YOUR_KEY_HERE` → Your Clerk publishable key
- `sk_test_YOUR_KEY_HERE` → Your Clerk secret key
- `whsec_YOUR_SECRET_HERE` → Your Clerk webhook secret
- `YOUR_ANON_KEY_HERE` → Your Supabase anon key
- `YOUR_SERVICE_ROLE_KEY_HERE` → Your Supabase service_role key

---

## Step 5: Test the Application

1. In your terminal, run:
   ```bash
   npm run dev
   ```

2. Open your browser and go to: http://localhost:3000

3. You should see the homepage! 🎉

---

## Step 6: Create Your First Admin User

1. On the website, click **Sign In**
2. Sign up with your email (or Google/Apple)
3. After signing in, go to your Supabase dashboard
4. Go to **Table Editor** → **users** table
5. Find your user (search by email)
6. Click on the row to edit
7. Change `role` from `user` to `admin`
8. Save
9. Go back to the website and refresh
10. You should now see **Admin** in the navbar! 🎉

---

## Step 7: (Optional) Add Sample Data

1. Go to Supabase dashboard → **SQL Editor**
2. Open `supabase/seed.sql` from this project
3. Copy all contents
4. Paste into SQL Editor
5. Click **Run**

This will add sample events, competitions, and announcements.

---

## Troubleshooting

### "Cannot connect to Supabase"
- Check your `.env.local` file has the correct Supabase URL and keys
- Make sure you copied the keys correctly (no extra spaces)

### "Clerk authentication not working"
- Verify your Clerk keys in `.env.local`
- Check that you've enabled the authentication methods in Clerk dashboard

### "Images not uploading"
- Make sure you created the `uploads` bucket in Supabase Storage
- Verify the bucket is set to **Public**
- Check that `SUPABASE_SERVICE_ROLE_KEY` is correct

### "Admin access not working"
- Make sure you changed your user role to `admin` in Supabase `users` table
- Sign out and sign back in
- Clear browser cache

### Database errors
- Make sure you ran the `schema-simple.sql` file
- Check that all tables exist in Supabase Table Editor

---

## Next Steps

1. ✅ Customize the homepage content
2. ✅ Add your first event through Admin → Events
3. ✅ Upload gallery images through Admin → Gallery
4. ✅ Create competitions through Admin → Competitions
5. ✅ Deploy to Vercel when ready!

---

## Need More Help?

- Check `README.md` for detailed documentation
- Check `SETUP.md` for additional setup tips

