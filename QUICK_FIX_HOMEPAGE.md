# Quick Fix: Homepage Settings Error

## Error Message
```
Error fetching homepage settings: "Could not find the table 'public.homepage_settings' in the schema cache"
```

## Solution: Create the Table

### Step 1: Go to Supabase SQL Editor
1. Open: https://supabase.com/dashboard/project/vzlxgaquuusnwptpzryp
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Run This SQL

Copy the ENTIRE SQL below and paste it into the SQL Editor, then click **Run**:

```sql
-- Homepage Settings Table
CREATE TABLE IF NOT EXISTS homepage_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Insert default settings
INSERT INTO homepage_settings (key, value, type) VALUES
('hero_title', 'Youth of Christha Jyothi', 'text'),
('hero_subtitle', 'CSI Christha Jyothi Church - Building a vibrant community of faith, fellowship, and service', 'text'),
('hero_background_image', NULL, 'image'),
('hero_background_color', 'from-blue-50 via-indigo-50 to-purple-50', 'text'),
('announcements_enabled', 'true', 'text')
ON CONFLICT (key) DO NOTHING;

-- Create index
CREATE INDEX IF NOT EXISTS idx_homepage_settings_key ON homepage_settings(key);

-- Enable RLS
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Homepage settings are viewable by everyone" ON homepage_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update homepage settings" ON homepage_settings
  FOR UPDATE USING (true);

CREATE POLICY "Admins can insert homepage settings" ON homepage_settings
  FOR INSERT WITH CHECK (true);
```

### Step 3: Verify
1. Go to **Table Editor** in Supabase
2. You should see `homepage_settings` table
3. It should have 5 rows

### Step 4: Refresh Your Website
1. Refresh your browser
2. The error should be gone! ✅

## After This Works

You can now:
- Go to **Admin → Homepage Settings**
- Edit hero title, subtitle, background images
- Customize your homepage!

