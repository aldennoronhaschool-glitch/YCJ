-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT,
  banner_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  team_name TEXT,
  payment_mode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON gallery(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_competition_id ON registrations(competition_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events (public read, admin write)
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (published = true OR auth.role() = 'admin');

CREATE POLICY "Admins can insert events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Admins can update events" ON events
  FOR UPDATE USING (auth.role() = 'admin');

CREATE POLICY "Admins can delete events" ON events
  FOR DELETE USING (auth.role() = 'admin');

-- RLS Policies for gallery (public read, admin write)
CREATE POLICY "Gallery is viewable by everyone" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert gallery images" ON gallery
  FOR INSERT WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Admins can delete gallery images" ON gallery
  FOR DELETE USING (auth.role() = 'admin');

-- RLS Policies for competitions (public read, admin write)
CREATE POLICY "Competitions are viewable by everyone" ON competitions
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert competitions" ON competitions
  FOR INSERT WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Admins can update competitions" ON competitions
  FOR UPDATE USING (auth.role() = 'admin');

CREATE POLICY "Admins can delete competitions" ON competitions
  FOR DELETE USING (auth.role() = 'admin');

-- RLS Policies for registrations (users can insert their own, admins can read all)
CREATE POLICY "Users can insert their own registrations" ON registrations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Admins can view all registrations" ON registrations
  FOR SELECT USING (auth.role() = 'admin');

-- RLS Policies for announcements (public read, admin write)
CREATE POLICY "Announcements are viewable by everyone" ON announcements
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert announcements" ON announcements
  FOR INSERT WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Admins can update announcements" ON announcements
  FOR UPDATE USING (auth.role() = 'admin');

CREATE POLICY "Admins can delete announcements" ON announcements
  FOR DELETE USING (auth.role() = 'admin');

-- Note: For production, you'll need to set up proper authentication functions
-- that map Clerk user IDs to Supabase auth.uid()
-- This is a simplified version. In production, use Supabase Auth or create
-- a function that validates Clerk JWT tokens.

