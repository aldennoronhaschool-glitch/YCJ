-- Add display_telephone field to contact_settings table
-- This field allows admins to control what phone number is displayed to visitors
-- Default value is 'xxxxxxx' to mask the phone number

-- Insert the display_telephone setting if it doesn't exist
INSERT INTO contact_settings (key, value, created_at, updated_at)
VALUES ('display_telephone', 'xxxxxxx', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;

-- Add comment
COMMENT ON COLUMN contact_settings.key IS 'Setting key - can include display_telephone for masked phone display';
