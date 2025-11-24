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
('announcements_enabled', 'true', 'text'),
('service_times_enabled', 'true', 'text'),
('service_1_label', '1st Service', 'text'),
('service_1_time', '8 AM', 'text'),
('service_2_label', '2nd Service', 'text'),
('service_2_time', '10:00 AM', 'text'),
('service_3_label', '3rd Service', 'text'),
('service_3_time', '12:00 PM', 'text'),
('service_4_label', '4th Service', 'text'),
('service_4_time', '6 PM', 'text'),
('service_language', 'ALL SERVICES IN ENGLISH', 'text'),
('welcome_note', 'This life is a beautiful gift of God. Life can get both fair and unfair at times. We find ourselves fighting battles (some meaningful and some meaningless) and believe they are here to stay. Many call life a race and some don''t even know why they are running it. In the midst of it all, we pray that God''s pure light would lead your way and you would know He truly cares.

We pray that God would provide for you the comfort and strength He has promised His children and that you would discover the freedom in trusting the One who will never let you down. The Lord builds both our character and competence for HIS glory in us.

God has been gracious and we are here not by our strength but by His faithfulness. He built the Youth of Christha Jyothi brick by brick while we stood lifting our hands in worship. Our prayer is that this family at YCJ would abound in God''s love, goodness, and grace. We pray that you would find God in this kingdom to place and time of your life. There is hope and rest in Him for all who are Seeking. We pray you wouldn''t miss it.', 'text'),
('welcome_note_signature', 'Youth of Christha Jyothi Leadership', 'text'),
('contact_email', 'info@ycjchurch.org', 'text'),
('contact_phone', '+91 (XX) XXXX XXXX', 'text'),
('contact_phone_hours', 'Tuesday to Sunday', 'text'),
('contact_office_hours', '10:00am to 6:00pm', 'text'),
('contact_office_days', 'Tuesday to Sunday', 'text'),
('contact_address_line1', 'CSI Christa Jyothi Church', 'text'),
('contact_address_line2', 'Bima Nagar, Bailoor, Udupi, Karnataka 576101', 'text'),
('social_facebook', '', 'text'),
('social_instagram', '', 'text'),
('social_youtube', '', 'text'),
('social_whatsapp', '', 'text')
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
