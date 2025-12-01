# Event Registration Feature Setup

This document explains the new event registration feature that has been added to your YCJ website.

## Overview

Users can now register for events directly from your website. Admins can view and manage all event registrations through the admin panel.

## Features Added

### For Users:
- **Event Registration Form**: Users can register for events with their details (name, email, phone, age, and additional info)
- **Authentication Required**: Users must be signed in to register for events
- **Confirmation**: Users receive a toast notification upon successful registration

### For Admins:
- **View All Registrations**: See all event registrations in one place
- **Filter by Event**: Filter registrations by specific events
- **Export to CSV**: Download registration data as CSV for offline processing
- **Delete Registrations**: Remove unwanted or spam registrations
- **Quick Access**: Button on each event in the event management page to view its registrations
- **Dashboard Stats**: See total event registrations count on the admin dashboard

## Database Setup

You need to create the `event_registrations` table in your Supabase database.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/migrations/create_event_registrations.sql`
4. Paste it into the SQL Editor and run it

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

## Files Created

### Components:
- `components/event-registration-form.tsx` - User-facing registration form
- `components/admin/event-registrations-manager.tsx` - Admin component to manage registrations

### API Routes:
- `app/api/event-registrations/route.ts` - Handle registration submissions
- `app/api/event-registrations/[id]/route.ts` - Handle registration deletion

### Admin Pages:
- `app/admin/event-registrations/page.tsx` - Admin page to view all registrations

### Library Functions:
- `lib/supabase/event-registrations.ts` - Database operations for event registrations

### Database:
- `supabase/migrations/create_event_registrations.sql` - SQL migration file

## Files Modified

- `app/admin/page.tsx` - Added event registrations card and stats
- `components/admin/events-manager.tsx` - Added "Manage Registrations" button for each event

## How to Use

### For Users:
1. Navigate to an event page
2. Click on "Register" button (you'll need to add this button to your event display pages)
3. Fill in the registration form
4. Submit

### For Admins:
1. Go to Admin Dashboard
2. Click on "Manage Event Registrations" card, OR
3. Go to Event Management and click the Users icon next to any event
4. View, filter, export, or delete registrations as needed

## Next Steps

To complete the integration, you need to:

1. **Run the SQL migration** in your Supabase database (see Database Setup above)

2. **Add registration buttons to your event pages** - You'll need to add a "Register" button on your public event pages that opens the registration form. Example:

```tsx
import { EventRegistrationForm } from "@/components/event-registration-form";

// In your event page component:
<EventRegistrationForm event={event} />
```

3. **Test the functionality**:
   - Try registering for an event as a regular user
   - View the registration in the admin panel
   - Test the CSV export feature
   - Test filtering by event

## Troubleshooting

- **Registration not saving**: Make sure you've run the SQL migration
- **Permission errors**: Check that Row Level Security policies are properly set up in Supabase
- **Can't see registrations**: Ensure you're logged in as an admin

## Support

If you encounter any issues, check:
1. Browser console for errors
2. Supabase logs for database errors
3. Network tab for API request failures
