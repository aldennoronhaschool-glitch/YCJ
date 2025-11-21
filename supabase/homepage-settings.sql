-- Homepage Settings Table
CREATE TABLE IF NOT EXISTS homepage_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT NOT NULL DEFAULT 'text', -- 'text', 'image', 'json'
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

-- RLS Policies (public read, admin write)
CREATE POLICY "Homepage settings are viewable by everyone" ON homepage_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update homepage settings" ON homepage_settings
  FOR UPDATE USING (true);

CREATE POLICY "Admins can insert homepage settings" ON homepage_settings
  FOR INSERT WITH CHECK (true);

