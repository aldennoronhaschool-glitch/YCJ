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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Event Management</h1>
            <p className="text-muted-foreground text-lg">Create, update, and manage events</p>
          </div>
          <Button asChild>
            <Link href="/admin/events/new">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Link>
          </Button>
        </div>

        <EventsManager initialEvents={events} />
      </div>
    </div>
  );
}

