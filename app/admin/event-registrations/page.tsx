import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllEventRegistrations } from "@/lib/supabase/event-registrations";
import { getAllEvents } from "@/lib/supabase/events";
import { EventRegistrationsManager } from "@/components/admin/event-registrations-manager";

export default async function AdminEventRegistrationsPage() {
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

    const registrations = await getAllEventRegistrations();
    const events = await getAllEvents(true);

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                            Event Registrations
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            View and manage all event registrations
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/events">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Link>
                    </Button>
                </div>

                <EventRegistrationsManager initialRegistrations={registrations} events={events} />
            </div>
        </div>
    );
}
