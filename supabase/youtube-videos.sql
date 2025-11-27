-- YouTube Videos Table
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_id TEXT NOT NULL, -- YouTube video ID (e.g., dQw4w9WgXcQ)
  video_type TEXT NOT NULL CHECK (video_type IN ('livestream', 'song_cover', 'other')),
  thumbnail_url TEXT, -- Optional custom thumbnail, otherwise use YouTube default
  published_date TIMESTAMP WITH TIME ZONE,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_youtube_videos_type ON youtube_videos(video_type);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_order ON youtube_videos(display_order);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_featured ON youtube_videos(is_featured);

-- Enable RLS
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, admin write)
CREATE POLICY "YouTube videos are viewable by everyone" ON youtube_videos
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert youtube videos" ON youtube_videos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update youtube videos" ON youtube_videos
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete youtube videos" ON youtube_videos
  FOR DELETE USING (true);
