# Setup Homepage Settings Table

The `homepage_settings` table is missing from your Supabase database. Follow these steps to create it:

## Steps to Create the Table

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/vzlxgaquuusnwptpzryp
   - Or go to https://supabase.com/dashboard and select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query" button

3. **Copy and Run the SQL**
   - Copy the entire contents of `supabase/homepage-settings.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify the Table**
   - Go to "Table Editor" in the left sidebar
   - You should see `homepage_settings` table
   - It should have default values for all settings

## What This Creates

- Creates the `homepage_settings` table
- Inserts default values for:
  - Hero section (title, subtitle, background)
  - Service times (4 services with labels and times)
  - Welcome note
  - Contact information
  - Toggle switches (announcements, service times)

## After Running the SQL

Once you've run the SQL:
1. Refresh your website
2. Go to `/admin/homepage` to edit settings
3. All settings should now save properly

## Troubleshooting

If you get any errors:
- Make sure you're using the correct Supabase project
- Check that you have the necessary permissions
- Try running the SQL in smaller chunks if needed

