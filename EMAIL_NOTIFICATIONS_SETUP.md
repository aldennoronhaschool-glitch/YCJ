# Email Notification Setup Guide

This guide will help you set up email notifications for contact form submissions.

## Overview

When someone submits the contact form on your website, you (the admin) will receive an email notification with all the details.

## Setup Steps

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name like "YCJ Website Notifications"
5. Copy the API key (it starts with `re_`)

### 3. Verify Your Domain (Optional but Recommended)

**Option A: Use Resend's Test Domain (Quick Start)**
- You can start immediately using Resend's test domain
- Emails will be sent from `onboarding@resend.dev`
- Limited to sending to your own verified email only

**Option B: Verify Your Own Domain (Production)**
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `ycjchurch.org`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually takes a few minutes)

### 4. Add Environment Variables

Add these variables to your `.env.local` file:

```env
# Resend API Key (required)
RESEND_API_KEY=re_your_api_key_here

# Admin email - where notifications will be sent (required)
ADMIN_EMAIL=your-email@example.com

# From email - who the email appears to be from (optional)
# If using Resend's test domain:
FROM_EMAIL=onboarding@resend.dev
# If using your own verified domain:
FROM_EMAIL=notifications@ycjchurch.org
```

### 5. Restart Your Development Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 6. Test the Contact Form

1. Go to your contact page
2. Fill out and submit the form
3. Check your admin email inbox
4. You should receive a beautifully formatted email with all the submission details

## Email Template Features

The notification email includes:
- ✅ Sender's full name and contact information
- ✅ Email and phone (clickable links)
- ✅ City and church connection status
- ✅ Message title and full message body
- ✅ Timestamp of submission
- ✅ Professional, branded design

## Troubleshooting

### Not receiving emails?

1. **Check spam folder** - First time emails might go to spam
2. **Verify API key** - Make sure `RESEND_API_KEY` is correct
3. **Check admin email** - Verify `ADMIN_EMAIL` is set correctly
4. **Check server logs** - Look for error messages in your terminal
5. **Verify domain** - If using custom domain, ensure DNS records are verified

### Using test domain limitations

If you're using `onboarding@resend.dev`:
- You can only send to email addresses you've verified in Resend
- Go to Resend dashboard → Settings → Verified Emails
- Add and verify your admin email address

### Form still works even if email fails

The system is designed to be resilient:
- Contact form submissions are saved to database regardless
- Email sending happens after database save
- If email fails, the form submission still succeeds
- You can always view submissions in the admin panel

## Production Deployment

When deploying to Vercel/production:

1. Add the same environment variables in your hosting platform:
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`
   - `FROM_EMAIL`

2. For Vercel:
   - Go to your project settings
   - Navigate to **Environment Variables**
   - Add each variable
   - Redeploy your application

## Cost

- **Free tier**: 100 emails/day, 3,000/month
- **Pro tier**: $20/month for 50,000 emails/month
- For a church website, the free tier should be more than sufficient

## Support

If you need help:
- Resend documentation: [https://resend.com/docs](https://resend.com/docs)
- Check the server logs for detailed error messages
- Ensure all environment variables are set correctly
