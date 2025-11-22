# Office Bearers Setup Guide

## ⚠️ CRITICAL: Create the Database Table First!

**If you see "Could not find the table 'public.office_bearers'", you MUST run the SQL migration below!**

### Step 1: Create the Database Table (REQUIRED)

The `office_bearers` table must exist in your Supabase database. Follow these steps:

1. Go to your Supabase project: https://supabase.com/dashboard/project/vzlxgaquuusnwptpzryp
2. Click **SQL Editor** in the left sidebar
3. Click **New Query** (or the "+" button)
4. Copy the ENTIRE SQL below and paste it into the SQL Editor:

```sql
-- Office Bearers Table
CREATE TABLE IF NOT EXISTS office_bearers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_office_bearers_order ON office_bearers(order_index);

-- Enable RLS
ALTER TABLE office_bearers ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, admin write handled in app)
CREATE POLICY "Office bearers are viewable by everyone" ON office_bearers
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert office bearers" ON office_bearers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update office bearers" ON office_bearers
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete office bearers" ON office_bearers
  FOR DELETE USING (true);
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" or similar success message

### Step 2: Verify the Table Was Created

1. In Supabase, go to **Table Editor**
2. You should see a new table called `office_bearers`
3. It should have these columns:
   - `id` (UUID)
   - `name` (TEXT)
   - `role` (TEXT)
   - `photo_url` (TEXT, nullable)
   - `order_index` (INTEGER)
   - `created_at` (TIMESTAMP)

### Step 3: Check Supabase Storage

Office bearer photos are uploaded to Supabase Storage. Make sure:

1. Go to **Storage** in Supabase
2. You should have a bucket called `uploads`
3. If it doesn't exist, create it:
   - Click **New bucket**
   - Name: `uploads`
   - Make it **Public** (or configure RLS policies)
   - Click **Create bucket**

### Step 4: Verify Admin Access

Make sure you're logged in as an admin:

1. Go to `/admin/login`
2. Sign in with your admin account
3. Verify your user has `role = 'admin'` in the Supabase `users` table

### Step 5: Test the Upload

1. Go to `/admin/office-bearers`
2. Fill in:
   - Name: Test Name
   - Role: Test Role
3. Click **Upload Photo** and select an image
4. Wait for "Image uploaded" message
5. Click **Add Office Bearer**

### Common Issues & Solutions

#### Issue 1: "Table does not exist" error
**Solution:** Run the SQL migration from `supabase/office-bearers.sql`

#### Issue 2: "Upload failed" error
**Solution:** 
- Check that the `uploads` bucket exists in Supabase Storage
- Verify the bucket is public or has proper RLS policies
- Check browser console for specific error messages

#### Issue 3: "Unauthorized" error
**Solution:**
- Make sure you're logged in
- Verify your user has admin role in Supabase `users` table
- Check that `isAdmin()` function is working correctly

#### Issue 4: Photo uploads but data doesn't save
**Solution:**
- Check browser console for errors
- Verify the API route `/api/admin/office-bearers` is accessible
- Check network tab in browser dev tools for failed requests

#### Issue 5: "Failed to create office bearer"
**Solution:**
- Check Supabase logs for database errors
- Verify RLS policies allow inserts
- Make sure name and role fields are not empty

### Debugging Steps

1. **Open Browser Console** (F12)
2. **Check Network Tab** for failed API requests
3. **Check for Error Messages** in the console
4. **Verify Environment Variables** are set correctly
5. **Check Supabase Logs** in the Supabase dashboard

### SQL to Check Table Exists

Run this in Supabase SQL Editor to verify:

```sql
SELECT * FROM office_bearers LIMIT 1;
```

If this returns an error, the table doesn't exist - run the migration!

### SQL to Check Storage Bucket

Run this in Supabase SQL Editor:

```sql
SELECT name, public FROM storage.buckets WHERE name = 'uploads';
```

If this returns no rows, create the bucket in Storage settings.

## Still Having Issues?

1. Check the browser console for specific error messages
2. Check Supabase logs for database errors
3. Verify all environment variables are set
4. Make sure you're using the latest code from GitHub

