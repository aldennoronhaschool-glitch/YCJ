# Environment Variables for Build

## Required for Build

During the build process, Next.js needs access to environment variables. Make sure you have a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
WEBHOOK_SECRET=whsec_...
```

## For Production Builds

If you're building for production (e.g., on Vercel), make sure to add these environment variables in your deployment platform's settings:

1. **Vercel**: Go to Project Settings → Environment Variables
2. Add all the variables listed above
3. Make sure `NEXT_PUBLIC_*` variables are available during build time

## Local Build

For local builds, create a `.env.local` file in the project root:

```bash
# Copy the template
cp ENV_TEMPLATE.txt .env.local

# Then edit .env.local and add your actual keys
```

## Important Notes

- `.env.local` is gitignored (not committed to repository)
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Never commit `.env.local` with real keys
- For production, use environment variables in your hosting platform

