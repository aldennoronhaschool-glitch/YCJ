# Phone Number Masking Feature

## Overview

The contact page now supports **phone number masking** to protect your privacy while still allowing you to manage the actual phone number in the admin panel.

**The masked phone number appears in:**
- Contact page (`/contact`)
- Navigation menu contact dropdown (hover over "CONTACT")

## How It Works

### For Visitors (Public)
- By default, visitors see **"xxxxxxx"** instead of your real phone number
- The masked number is **not clickable** (no tel: link)
- If you choose to display a real number, it becomes clickable
- This applies to both the contact page and the navbar dropdown

### For Admins
- You can edit both the **actual telephone** and the **display telephone** in the admin panel
- Navigate to `/admin/contact` to manage these settings

## Settings

### 1. Telephone (Internal Use)
- **Location:** Admin Panel → Contact Settings
- **Purpose:** Store the actual phone number for internal records
- **Visibility:** Only visible to admins
- **Example:** `+91 (80) 6753 7777`

### 2. Display Telephone (Public)
- **Location:** Admin Panel → Contact Settings  
- **Purpose:** What visitors see on the contact page
- **Visibility:** Public (shown on `/contact` page)
- **Options:**
  - `xxxxxxx` - Masks the phone number (default)
  - Any number - Displays that number to visitors

## Setup Instructions

### Step 1: Run the SQL Script

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/contact-display-telephone.sql`
4. Click "Run"

This will add the `display_telephone` setting to your database with a default value of `xxxxxxx`.

### Step 2: Configure in Admin Panel

1. Log in as admin
2. Go to `/admin/contact`
3. Find the "Contact Information" section
4. You'll see two fields:
   - **Telephone (Internal Use)** - Your actual phone number
   - **Display Telephone (Public)** - What visitors see

5. Set the Display Telephone to:
   - `xxxxxxx` to hide the number
   - A real number to display it publicly

6. Click "Save All Changes"

## Examples

### Example 1: Hide Phone Number (Default)
```
Telephone (Internal): +91 (80) 6753 7777
Display Telephone: xxxxxxx
```
**Result:** Visitors see "xxxxxxx" (not clickable)

### Example 2: Show Phone Number
```
Telephone (Internal): +91 (80) 6753 7777
Display Telephone: +91 (80) 6753 7777
```
**Result:** Visitors see "+91 (80) 6753 7777" (clickable tel: link)

### Example 3: Show Different Number
```
Telephone (Internal): +91 (80) 6753 7777
Display Telephone: +91 1800 123 4567
```
**Result:** Visitors see "+91 1800 123 4567" (clickable tel: link)

## Benefits

✅ **Privacy Protection** - Hide your real phone number from public view
✅ **Spam Prevention** - Reduce unwanted calls from web scrapers
✅ **Flexibility** - Easily switch between showing and hiding the number
✅ **Admin Control** - Change the display number anytime without code changes
✅ **Contact Form** - Visitors can still reach you via the contact form

## Technical Details

### Files Modified

1. **`lib/supabase/contact.ts`**
   - Added `display_telephone` to default settings
   - Both `getContactSettings()` and `getContactSettingsPublic()`

2. **`app/contact/page.tsx`**
   - Updated to use `display_telephone` instead of `telephone`
   - Conditional rendering: clickable if real number, plain text if masked

3. **`components/navbar.tsx`**
   - Fetches contact settings from API
   - Displays masked phone in contact dropdown
   - Updates dynamically when settings change

4. **`app/admin/contact/page.tsx`**
   - Added "Display Telephone (Public)" field
   - Added helpful descriptions for both fields

5. **`supabase/contact-display-telephone.sql`**
   - SQL script to add the setting to database

### Database Schema

The `contact_settings` table stores key-value pairs. The new setting:

```sql
key: 'display_telephone'
value: 'xxxxxxx' (default)
```

## Troubleshooting

### Phone number still showing
1. Make sure you ran the SQL script
2. Check that `display_telephone` is set to `xxxxxxx` in admin panel
3. Clear your browser cache
4. Verify the setting saved correctly

### Changes not appearing
1. Make sure you clicked "Save All Changes"
2. Refresh the contact page
3. Check Supabase for the updated value

### Want to show number again
1. Go to `/admin/contact`
2. Set "Display Telephone (Public)" to your actual number
3. Save changes

---

**Created:** 2025-11-25
**Feature:** Phone Number Masking
**Status:** ✅ Ready to use (after running SQL script)
