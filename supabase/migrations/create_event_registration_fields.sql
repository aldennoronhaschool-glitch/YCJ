-- Create event_registration_fields table to store custom form fields for each event
CREATE TABLE IF NOT EXISTS event_registration_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'email', 'phone', 'number', 'textarea', 'select')),
  field_options TEXT[], -- For select/dropdown fields
  is_required BOOLEAN DEFAULT true,
  field_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_registration_fields_event_id ON event_registration_fields(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registration_fields_order ON event_registration_fields(event_id, field_order);

-- Enable Row Level Security (RLS)
ALTER TABLE event_registration_fields ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view registration fields for published events
CREATE POLICY "Anyone can view event registration fields"
  ON event_registration_fields
  FOR SELECT
  USING (true);

-- Policy: Service role can do everything (for admin operations)
CREATE POLICY "Service role has full access to event registration fields"
  ON event_registration_fields
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Update event_registrations table to store custom field responses
ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Create index for custom fields
CREATE INDEX IF NOT EXISTS idx_event_registrations_custom_fields ON event_registrations USING gin(custom_fields);
