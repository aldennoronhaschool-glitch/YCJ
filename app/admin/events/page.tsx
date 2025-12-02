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
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Event Management</h1>
          <p className="text-muted-foreground text-base md:text-lg">Create, update, and manage events</p>
        </div>

        <EventsManager initialEvents={events} />

        {/* Floating Action Button for New Event */}
        <Button
          asChild
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-2xl h-14 w-14 md:h-16 md:w-16 z-50 hover:scale-110 transition-transform"
        >
          <Link href="/admin/events/new" className="flex items-center justify-center">
            <Plus className="w-6 h-6 md:w-7 md:h-7" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

