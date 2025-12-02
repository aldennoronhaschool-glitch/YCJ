-- Function to create default registration fields for an event
CREATE OR REPLACE FUNCTION create_default_registration_fields(p_event_id UUID)
RETURNS void AS $$
BEGIN
  -- Check if fields already exist for this event
  IF NOT EXISTS (SELECT 1 FROM event_registration_fields WHERE event_id = p_event_id) THEN
    -- Insert default fields
    INSERT INTO event_registration_fields (event_id, field_label, field_type, is_required, field_order)
    VALUES
      (p_event_id, 'Name', 'text', true, 0),
      (p_event_id, 'Email', 'email', true, 1),
      (p_event_id, 'Phone', 'phone', true, 2),
      (p_event_id, 'Age', 'number', true, 3);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically add default fields when a new event is created
CREATE OR REPLACE FUNCTION trigger_create_default_registration_fields()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_registration_fields(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS auto_create_registration_fields ON events;
CREATE TRIGGER auto_create_registration_fields
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_registration_fields();

-- Backfill default fields for existing events that don't have any fields
DO $$
DECLARE
  event_record RECORD;
BEGIN
  FOR event_record IN 
    SELECT id FROM events 
    WHERE id NOT IN (SELECT DISTINCT event_id FROM event_registration_fields)
  LOOP
    PERFORM create_default_registration_fields(event_record.id);
  END LOOP;
END $$;
