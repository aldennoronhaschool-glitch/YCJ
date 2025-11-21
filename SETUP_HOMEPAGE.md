# Homepage Settings Setup

## Quick Fix for "Error fetching homepage settings"

This error means the `homepage_settings` table doesn't exist in your database yet. Follow these steps:

### Step 1: Run the Database Migration

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/vzlxgaquuusnwptpzryp
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/homepage-settings.sql` from this project
5. Copy **ALL** the SQL code from that file
6. Paste it into the Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. You should see "Success. No rows returned" or similar

### Step 2: Verify the Table Was Created

1. In Supabase, go to **Table Editor**
2. You should see a new table called `homepage_settings`
3. It should have some default rows with settings

### Step 3: Test the Homepage

1. Refresh your website homepage
2. The error should be gone
3. Go to Admin → Homepage Settings to customize

## What the Migration Creates

- `homepage_settings` table to store homepage configuration
- Default settings for hero title, subtitle, background, etc.
- Proper indexes and RLS policies

## If You Still Get Errors

1. Make sure you ran the **entire** SQL file (not just part of it)
2. Check that the table exists in Supabase Table Editor
3. Verify you're connected to the correct Supabase project
4. Restart your dev server: `npm run dev`

## Default Settings

After running the migration, you'll have these default settings:
- Hero Title: "Youth of Christha Jyothi"
- Hero Subtitle: "CSI Christha Jyothi Church - Building a vibrant community..."
- Background: Gradient (from-blue-50 via-indigo-50 to-purple-50)
- Announcements: Enabled

You can change all of these from Admin → Homepage Settings!

