// Login page layout - bypasses admin auth check
// This layout is separate from admin layout to allow login without auth
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly without any auth checks
  // The login page will handle its own authentication flow
  return <>{children}</>;
}

