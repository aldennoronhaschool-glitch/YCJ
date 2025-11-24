-- Create table for gallery folder metadata
CREATE TABLE IF NOT EXISTS gallery_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folder_name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_gallery_folders_name ON gallery_folders(folder_name);
