// Note: Next.js 16 deprecates the "middleware" file convention in favor of "proxy"
// However, Clerk's clerkMiddleware still uses the middleware pattern.
// This warning is informational and can be safely ignored until Clerk updates their package.
// The middleware functionality works correctly despite the warning.

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/events(.*)",
  "/gallery",
  "/register",
  "/api/webhooks(.*)",
  "/admin/login",
]);

const isApiRoute = createRouteMatcher([
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Skip API routes - they handle auth themselves
  if (isApiRoute(request)) {
    return;
  }
  
  // Only protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes (but we'll skip auth protection in middleware)
    "/(api|trpc)(.*)",
  ],
};

