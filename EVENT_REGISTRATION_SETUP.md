# Event Registration Feature - Custom Fields Setup

This document explains the custom event registration fields feature that has been added to your YCJ website.

## Overview

Admins can now **fully customize** the registration form for each event. You can:
- Add, edit, delete, and reorder fields
- Make any field required or optional
- Choose from multiple field types (text, email, phone, number, textarea, dropdown)
- Even customize or remove the default fields (Name, Email, Phone, Age)

## Features

### For Admins:
- **Full Field Customization**: Control every field in the registration form
- **Default Fields Auto-Created**: When you create a new event, default fields (Name, Email, Phone, Age) are automatically added
- **Flexible Field Management**:
  - Add custom fields (e.g., T-Shirt Size, Dietary Restrictions, etc.)
  - Make any field required or optional
  - Reorder fields using up/down arrows
  - Delete fields you don't need
  - Edit field types and options
- **Multiple Field Types**:
  - Text input
  - Email input
  - Phone input
  - Number input
  - Long text (Textarea)
  - Dropdown (Select with custom options)

### For Users:
- **Dynamic Forms**: Each event can have a completely different registration form
- **Smart Validation**: Required fields are enforced
- **User-Friendly**: Clear labels and appropriate input types

## Database Setup

You need to run **THREE** SQL migrations in your Supabase database:

### Step 1: Create the base tables
Go to Supabase Dashboard → SQL Editor and run:

1. **create_event_registrations.sql** - Creates the event_registrations table
2. **create_event_registration_fields.sql** - Creates the event_registration_fields table
3. **make_fields_nullable.sql** - Makes standard fields nullable
4. **add_default_registration_fields.sql** - Adds automatic default field creation

### Quick Setup (All-in-One)

Or run all migrations at once by copying and pasting this complete SQL:

```sql
-- 1. Create event_registrations table (if not exists)
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  age INTEGER,
  additional_info TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert event registrations"
  ON event_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own registrations"
  ON event_registrations FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Service role has full access to event registrations"
  ON event_registrations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. Create event_registration_fields table
CREATE TABLE IF NOT EXISTS event_registration_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'email', 'phone', 'number', 'textarea', 'select')),
  field_options TEXT[],
  is_required BOOLEAN DEFAULT true,
  field_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_registration_fields_event_id ON event_registration_fields(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registration_fields_order ON event_registration_fields(event_id, field_order);

ALTER TABLE event_registration_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event registration fields"
  ON event_registration_fields FOR SELECT
  USING (true);

CREATE POLICY "Service role has full access to event registration fields"
  ON event_registration_fields FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Make standard fields nullable
ALTER TABLE event_registrations ALTER COLUMN name DROP NOT NULL;
ALTER TABLE event_registrations ALTER COLUMN email DROP NOT NULL;
ALTER TABLE event_registrations ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE event_registrations ALTER COLUMN age DROP NOT NULL;

-- 4. Add default field creation function and trigger
CREATE OR REPLACE FUNCTION create_default_registration_fields(p_event_id UUID)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM event_registration_fields WHERE event_id = p_event_id) THEN
    INSERT INTO event_registration_fields (event_id, field_label, field_type, is_required, field_order)
    VALUES
      (p_event_id, 'Name', 'text', true, 0),
      (p_event_id, 'Email', 'email', true, 1),
      (p_event_id, 'Phone', 'phone', true, 2),
      (p_event_id, 'Age', 'number', true, 3);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_create_default_registration_fields()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_registration_fields(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_create_registration_fields ON events;
CREATE TRIGGER auto_create_registration_fields
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_registration_fields();

-- Backfill default fields for existing events
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
```

## How to Use

### For Admins:

1. **Create a New Event**: Default fields (Name, Email, Phone, Age) are automatically added
2. **Customize Fields**:
   - Go to Admin Dashboard → Events
   - Click "Customize Form" button next to any event
   - You'll see all current fields with options to:
     - Toggle Required/Optional
     - Reorder using ↑↓ arrows
     - Delete fields you don't need
3. **Add Custom Fields**:
   - Scroll to "Add New Field" section
   - Enter field label (e.g., "T-Shirt Size")
   - Select field type
   - For dropdowns, enter comma-separated options
   - Check "Required field" if needed
   - Click "Add Field"

### For Users:

1. Navigate to an event page
2. Click "Register" button
3. Fill in the dynamic form (fields vary by event)
4. Submit registration

## Example Use Cases

### Workshop Event
- Name (required)
- Email (required)
- Experience Level (dropdown: Beginner, Intermediate, Advanced)
- Laptop Available? (dropdown: Yes, No)

### Sports Event
- Name (required)
- Phone (required)
- Age (required)
- T-Shirt Size (dropdown: S, M, L, XL, XXL)
- Emergency Contact (text)

### Conference Event
- Name (required)
- Email (required)
- Organization (text, optional)
- Dietary Restrictions (textarea, optional)
- Session Preference (dropdown with session names)

## Files Created/Modified

### New Files:
- `components/event-registration-form.tsx` - Dynamic user-facing form
- `components/admin/registration-fields-editor.tsx` - Admin field manager
- `app/admin/events/[id]/registration-fields/page.tsx` - Admin page
- `app/api/admin/event-registration-fields/route.ts` - Admin API (POST)
- `app/api/admin/event-registration-fields/[id]/route.ts` - Admin API (PATCH, DELETE)
- `app/api/event-registration-fields/route.ts` - Public API (GET)
- `lib/supabase/event-registration-fields.ts` - Database functions
- `supabase/migrations/create_event_registration_fields.sql`
- `supabase/migrations/add_default_registration_fields.sql`
- `supabase/migrations/make_fields_nullable.sql`

### Modified Files:
- `app/admin/events/page.tsx` - Added "Customize Form" button

## Troubleshooting

- **"Error fetching event registration fields"**: Run the SQL migrations in Supabase
- **Default fields not appearing**: Run the backfill script in the migration
- **Can't reorder fields**: Make sure you're clicking the up/down arrows
- **Registration not saving**: Check browser console and Supabase logs

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify all migrations have been run
4. Ensure RLS policies are correctly set up
