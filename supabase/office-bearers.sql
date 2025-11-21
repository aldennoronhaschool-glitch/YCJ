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


