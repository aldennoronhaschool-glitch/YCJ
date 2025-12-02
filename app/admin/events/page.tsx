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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Event Management</h1>
            <p className="text-muted-foreground text-base md:text-lg">Create, update, and manage events</p>
          </div>
          {/* Desktop button */}
          <Button asChild size="lg" className="hidden sm:flex whitespace-nowrap">
            <Link href="/admin/events/new">
              <Plus className="w-5 h-5 mr-2" />
              New Event
            </Link>
          </Button>
        </div>

        <EventsManager initialEvents={events} />

      </div>
    </div>
  );
}

