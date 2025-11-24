-- Contact Page Settings Table
CREATE TABLE IF NOT EXISTS contact_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Insert default contact settings
INSERT INTO contact_settings (key, value) VALUES
('telephone', '+91 (80) 6753 7777'),
('telephone_hours', 'Tuesday to Sunday'),
('email', 'info@ycjchurch.org'),
('office_hours', '10:00am to 6:00pm'),
('office_days', 'Tuesday to Sunday'),
('address_line1', 'CSI Christa Jyothi Church'),
('address_line2', 'Bima Nagar, Bailoor, Udupi'),
('address_line3', 'Karnataka 576101'),
('map_embed_url', ''),
('facebook_url', ''),
('twitter_url', ''),
('instagram_url', ''),
('youtube_url', ''),
('app_store_url', ''),
('play_store_url', ''),
('hero_title', 'Contact Us'),
('hero_subtitle', 'Get in touch with us')
ON CONFLICT (key) DO NOTHING;

-- Create index
CREATE INDEX IF NOT EXISTS idx_contact_settings_key ON contact_settings(key);

-- Enable RLS
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, admin write)
CREATE POLICY "Contact settings are viewable by everyone" ON contact_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update contact settings" ON contact_settings
  FOR UPDATE USING (true);

CREATE POLICY "Admins can insert contact settings" ON contact_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can delete contact settings" ON contact_settings
  FOR DELETE USING (true);
