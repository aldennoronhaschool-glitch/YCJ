-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own registrations
CREATE POLICY "Users can create event registrations"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can view their own registrations
CREATE POLICY "Users can view own event registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Policy: Service role can do everything (for admin operations)
CREATE POLICY "Service role has full access to event registrations"
  ON event_registrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
