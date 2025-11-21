# Admin Login Setup Guide

## How to Set Up Admin Access

### Step 1: Create an Account

1. Go to your website: `http://localhost:3000`
2. Click **Sign In** in the navbar
3. Sign up with your email (or use Google/Apple if enabled)
4. Complete the sign-up process

### Step 2: Grant Admin Access

After signing up, you need to manually set your user role to "admin" in Supabase:

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/vzlxgaquuusnwptpzryp
2. Click **Table Editor** in the left sidebar
3. Select the **users** table
4. Find your user (search by email or Clerk user ID)
5. Click on the row to edit it
6. Change the `role` field from `user` to `admin`
7. Click **Save**

### Step 3: Access Admin Dashboard

1. Go to: `http://localhost:3000/admin/login`
2. Sign in with your admin account
3. You'll be redirected to the admin dashboard

Or simply click **Admin** in the navbar (if you're signed in).

## Alternative: SQL Method

You can also set admin access using SQL in Supabase:

1. Go to **SQL Editor** in Supabase
2. Run this query (replace with your email):

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Admin Features

Once you have admin access, you can:

- ✅ Create, edit, and delete events
- ✅ Upload and manage gallery images
- ✅ Create and manage competitions
- ✅ View all registrations
- ✅ Download registrations as CSV
- ✅ Publish/unpublish events

## Security Notes

- Only users with `role = 'admin'` in the Supabase `users` table can access `/admin/*` routes
- Regular users will be redirected to the home page if they try to access admin routes
- Admin status is checked on every admin page load

## Troubleshooting

**Can't access admin dashboard?**
- Make sure you've set your role to "admin" in Supabase
- Sign out and sign back in
- Clear your browser cache

**Admin link not showing?**
- Make sure you're signed in
- The Admin link appears for all signed-in users, but only admins can actually access it

