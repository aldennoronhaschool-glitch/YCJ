# Contact Form Setup Guide

This guide will help you set up the contact form submission system for your YCJ Church website.

## Overview

The contact form system allows visitors to submit messages through your website. All submissions are stored in Supabase and can be managed through an admin panel.

## Features

✅ **Public Contact Form** - Visitors can submit messages without logging in
✅ **Database Storage** - All submissions stored securely in Supabase
✅ **Admin Dashboard** - View, filter, and manage submissions
✅ **Status Management** - Mark submissions as unread, read, or archived
✅ **Email & Phone Links** - Click to email or call directly from admin panel
✅ **Form Validation** - Client-side and server-side validation
✅ **Success/Error Messages** - User-friendly feedback

## Setup Instructions

### Step 1: Create the Database Table

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/contact-submissions.sql`
4. Click "Run" to execute the SQL

This will create:
- `contact_submissions` table with all necessary fields
- Row Level Security (RLS) policies
- Indexes for better performance

### Step 2: Verify the Setup

The following files have been created:

**Database Schema:**
- `supabase/contact-submissions.sql` - Database table and policies

**Backend:**
- `lib/supabase/contact-submissions.ts` - Database operations
- `app/api/contact/submit/route.ts` - Public submission endpoint
- `app/api/admin/contact-submissions/route.ts` - Admin management endpoint

**Frontend:**
- `components/contact-form.tsx` - Contact form component
- `app/contact/page.tsx` - Updated to use new form
- `app/admin/contact-submissions/page.tsx` - Admin dashboard

### Step 3: Test the Contact Form

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/contact` page
3. Fill out and submit the form
4. You should see a success message

### Step 4: Access the Admin Panel

1. Make sure you're logged in as an admin
2. Navigate to `/admin/contact-submissions`
3. You should see your test submission

## Admin Dashboard Features

### Statistics
- **Total** - All submissions
- **Unread** - New submissions that haven't been viewed
- **Read** - Submissions that have been opened
- **Archived** - Submissions moved to archive

### Filtering
Click the tabs to filter submissions by status:
- All
- Unread
- Read
- Archived

### Actions
- **View** - Click any submission to view full details
- **Mark as Read** - Automatically marked when opened
- **Archive** - Move to archive (click archive icon)
- **Delete** - Permanently remove (click trash icon)

### Contact Information
The admin panel displays:
- Name, email, phone, city
- Gender and church connection
- Message title and body
- Submission timestamp

You can click email addresses to send an email or phone numbers to call directly.

## Database Schema

### contact_submissions Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| first_name | TEXT | First name |
| last_name | TEXT | Last name |
| gender | TEXT | male or female |
| email | TEXT | Email address |
| phone | TEXT | Phone number |
| city | TEXT | City |
| connection | TEXT | Church connection type |
| message_title | TEXT | Subject/title |
| message_body | TEXT | Message content |
| status | TEXT | unread, read, or archived |
| created_at | TIMESTAMP | Submission time |
| updated_at | TIMESTAMP | Last update time |

## Security

### Row Level Security (RLS)

The table has RLS enabled with the following policies:

1. **Public Insert** - Anyone can submit the form (anonymous users)
2. **Authenticated Read** - Only logged-in users can view submissions
3. **Authenticated Update** - Only logged-in users can update status
4. **Authenticated Delete** - Only logged-in users can delete submissions

This ensures that:
- Visitors can submit forms without authentication
- Only admins can view and manage submissions
- Data is protected from unauthorized access

## API Endpoints

### Public Endpoint

**POST** `/api/contact/submit`
- Accepts contact form data
- Validates all fields
- Stores in database
- Returns success/error response

### Admin Endpoints

**GET** `/api/admin/contact-submissions`
- Fetch all submissions
- Add `?stats=true` for statistics only
- Requires authentication

**PATCH** `/api/admin/contact-submissions`
- Update submission status
- Requires authentication
- Body: `{ id: string, status: string }`

**DELETE** `/api/admin/contact-submissions?id={id}`
- Delete a submission
- Requires authentication

## Troubleshooting

### Form not submitting
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check Supabase connection

### Submissions not appearing in admin panel
1. Verify you're logged in as admin
2. Check database table exists
3. Verify RLS policies are correct

### Database errors
1. Ensure SQL script was run successfully
2. Check Supabase project is active
3. Verify environment variables are set

## Next Steps

### Optional Enhancements

1. **Email Notifications**
   - Set up email service (SendGrid, Resend, etc.)
   - Send notification when form is submitted
   - Auto-reply to submitter

2. **Export Data**
   - Add CSV export functionality
   - Download submissions for record-keeping

3. **Advanced Filtering**
   - Filter by date range
   - Search by name or email
   - Filter by connection type

4. **Analytics**
   - Track submission trends
   - Popular message topics
   - Response time metrics

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Review Supabase logs
3. Verify all environment variables are set correctly
4. Ensure database migrations were run successfully

---

**Created:** 2025-11-25
**Version:** 1.0
