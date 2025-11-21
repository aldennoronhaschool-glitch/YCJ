import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { auth } from "@clerk/nextjs/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { userId } = await auth();
    
    // If not signed in, redirect to admin login
    // This allows the login page to render (it has its own layout)
    if (!userId) {
      redirect("/admin/login");
    }

    // Check if user is admin
    const admin = await isAdmin();

    if (!admin) {
      // User is signed in but not admin - redirect to home
      redirect("/");
    }

    // User is authenticated and is admin - show admin dashboard with navbar
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  } catch (error) {
    // If auth fails, allow login page to render
    // The login page layout will handle rendering without Navbar
    return <>{children}</>;
  }
}

