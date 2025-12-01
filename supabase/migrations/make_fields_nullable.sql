-- Make standard fields nullable to allow full customization
ALTER TABLE event_registrations ALTER COLUMN name DROP NOT NULL;
ALTER TABLE event_registrations ALTER COLUMN email DROP NOT NULL;
ALTER TABLE event_registrations ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE event_registrations ALTER COLUMN age DROP NOT NULL;
