import { getAllEvents } from "@/lib/supabase/events";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventsManager } from "@/components/admin/events-manager";

export default async function AdminEventsPage() {
  const events = await getAllEvents(true);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Event Management</h1>
            <p className="text-muted-foreground text-base md:text-lg">Create, update, and manage events</p>
          </div>
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link href="/admin/events/new">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Link>
          </Button>
        </div>

        <EventsManager initialEvents={events} />

        {/* Floating Action Button for New Event - Mobile Only */}
        <Button
          asChild
          size="lg"
          className="md:hidden fixed bottom-6 right-6 rounded-full shadow-2xl h-16 w-16 z-50 hover:scale-110 transition-transform"
        >
          <Link href="/admin/events/new">
            <Plus className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

