-- About Us Page Content Table
CREATE TABLE IF NOT EXISTS about_us (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Insert default sections
INSERT INTO about_us (section_key, title, content, order_index) VALUES
('hero', 'About Us', 'Welcome to Youth of Christha Jyothi', 0),
('mission', 'Our Mission', 'To build a vibrant community of faith, fellowship, and service among the youth of CSI Christha Jyothi Church.', 1),
('vision', 'Our Vision', 'Empowering young people to grow in their faith and make a positive impact in their communities.', 2),
('history', 'Our History', 'Youth of Christha Jyothi has been serving the community for many years, bringing together young people in worship, service, and fellowship.', 3)
ON CONFLICT (section_key) DO NOTHING;

-- Create index
CREATE INDEX IF NOT EXISTS idx_about_us_order ON about_us(order_index);

-- Enable RLS
ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, admin write)
CREATE POLICY "About us content is viewable by everyone" ON about_us
  FOR SELECT USING (true);

CREATE POLICY "Admins can update about us content" ON about_us
  FOR UPDATE USING (true);

CREATE POLICY "Admins can insert about us content" ON about_us
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can delete about us content" ON about_us
  FOR DELETE USING (true);
