import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Image as ImageIcon, Trophy, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/supabase/events";
import { getAllRegistrations } from "@/lib/supabase/registrations";
import { getAllCompetitions } from "@/lib/supabase/competitions";

export default async function AdminDashboard() {
  // Check authentication and admin status
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/admin/login");
    }

    const admin = await isAdmin();

    if (!admin) {
      redirect("/");
    }
  } catch (error) {
    redirect("/admin/login");
  }

  const events = await getAllEvents(true);
  const registrations = await getAllRegistrations();
  const competitions = await getAllCompetitions();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage events, gallery, competitions, and registrations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">Total events</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Competitions</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{competitions.length}</div>
              <p className="text-xs text-muted-foreground">Active competitions</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrations.length}</div>
              <p className="text-xs text-muted-foreground">Total registrations</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Manage images</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Office Bearers</CardTitle>
              <CardDescription>Manage names, roles, and photos of office bearers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/office-bearers">Manage Office Bearers</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Homepage Settings</CardTitle>
              <CardDescription>Edit background images, hero text, service times, welcome note, and contact info</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/homepage">Manage Homepage</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Create, edit, and manage announcements displayed on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/announcements">Manage Announcements</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>Create, update, and manage events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/events">Manage Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Gallery Management</CardTitle>
              <CardDescription>Upload and manage event photos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/gallery">Manage Gallery</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Competition Management</CardTitle>
              <CardDescription>Create and manage competitions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/competitions">Manage Competitions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Contact Settings</CardTitle>
              <CardDescription>Edit contact page information, phone number, email, address, and social links</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/contact">Manage Contact Settings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>View and manage contact form submissions from visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/contact-submissions">View Submissions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
