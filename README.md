# YCJ Website - Youth of Christha Jyothi

A modern full-stack web application for CSI Christha Jyothi Church's youth community. Built with Next.js 14, TypeScript, Tailwind CSS, Clerk authentication, and Supabase.

## 🌟 Features

### For Users
- View latest events and announcements
- Browse event gallery with masonry layout
- Register for competitions
- User authentication via Clerk (Email, Google, Apple)

### For Admins
- Full CRUD operations for events
- Gallery management with image uploads
- Competition management
- View and download registrations as CSV
- Publish/unpublish events
- Role-based access control

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Clerk account and application

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
WEBHOOK_SECRET=your_clerk_webhook_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL script

3. **Set up Storage**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `uploads`
   - Set it to public (or configure policies as needed)
   - Allow public access for reading images

4. **Configure Row Level Security (RLS)**:
   - The schema includes RLS policies, but you may need to adjust them based on your authentication setup
   - For production, consider using Supabase Auth or creating custom functions to validate Clerk tokens

### 4. Clerk Setup

1. **Create a Clerk application** at [clerk.com](https://clerk.com)

2. **Configure authentication methods**:
   - Enable Email, Google, and Apple sign-in options
   - Set up your application URLs

3. **Set up Webhooks**:
   - Go to Webhooks in Clerk dashboard
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`
   - Copy the webhook signing secret to `WEBHOOK_SECRET` in `.env.local`

4. **Create Admin User**:
   - After a user signs up, you need to manually set their role to "admin" in the Supabase `users` table
   - Or create a script to do this programmatically

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👤 Setting Up Admin Access

To grant admin access to a user:

1. Sign up/login with Clerk
2. Go to your Supabase dashboard
3. Navigate to Table Editor → `users` table
4. Find the user by their email or Clerk user ID
5. Update the `role` field from `user` to `admin`

Alternatively, you can run this SQL in Supabase:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## 📁 Project Structure

```
├── app/
│   ├── (main)/          # Main layout with navbar
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── events/           # Events pages
│   ├── gallery/          # Gallery page
│   ├── register/         # Registration page
│   └── page.tsx          # Homepage
├── components/
│   ├── admin/            # Admin components
│   ├── ui/               # shadcn/ui components
│   └── navbar.tsx        # Navigation component
├── lib/
│   ├── supabase/         # Supabase utilities
│   └── auth.ts           # Authentication helpers
├── supabase/
│   └── schema.sql        # Database schema
└── proxy.ts              # Route protection (proxy)
```

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User accounts synced with Clerk
- **events**: Church events and activities
- **gallery**: Event photos
- **competitions**: Competition listings
- **registrations**: Competition registrations
- **announcements**: General announcements

See `supabase/schema.sql` for the complete schema.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables
4. Deploy!

### Environment Variables for Production

Make sure to add all the environment variables from `.env.local` to your Vercel project settings.

### Post-Deployment

1. Update Clerk webhook URL to your production domain
2. Update Clerk application URLs to include your production domain
3. Verify Supabase RLS policies work correctly in production

## 🔒 Security Notes

- Admin routes are protected by middleware
- Row Level Security (RLS) is enabled on all tables
- Image uploads are restricted to admin users
- User registrations are tied to authenticated Clerk users

## 📝 Features to Customize

- **Homepage Banner**: Update the hero section in `app/page.tsx`
- **Colors**: Modify Tailwind config in `tailwind.config.ts`
- **Components**: Customize shadcn/ui components in `components/ui/`
- **Database**: Extend schema in `supabase/schema.sql`

## 🐛 Troubleshooting

### Images not uploading
- Check Supabase Storage bucket permissions
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly

### Admin access not working
- Verify user role is set to "admin" in Supabase `users` table
- Check middleware is correctly protecting admin routes

### Webhook errors
- Verify `WEBHOOK_SECRET` matches Clerk dashboard
- Check webhook endpoint URL is correct

## 📄 License

This project is created for CSI Christha Jyothi Church.

## 🤝 Support

For issues or questions, please contact the development team.

---

Built with ❤️ for YCJ - Youth of Christha Jyothi

