# 🚀 Quick Start: Email Notifications

## What You Need (3 Environment Variables)

Add these to your `.env.local` file:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=your-email@example.com
FROM_EMAIL=onboarding@resend.dev
```

## Get Your API Key (2 minutes)

1. **Sign up**: https://resend.com
2. **Get API Key**: Dashboard → API Keys → Create API Key
3. **Copy the key** (starts with `re_`)

## Quick Test

1. Add the 3 environment variables above
2. Restart your dev server: `npm run dev`
3. Submit a test contact form
4. Check your email! 📧

## Important Notes

- ✅ Form submissions are saved even if email fails
- ✅ Free tier: 100 emails/day (plenty for a church website)
- ✅ Using test domain? Verify your admin email in Resend dashboard first
- ✅ Check spam folder for first email

## Full Documentation

See `EMAIL_NOTIFICATIONS_SETUP.md` for complete setup guide.
