-- Add custom_event_name to gallery table
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS custom_event_name TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_gallery_custom_event_name ON gallery(custom_event_name);
