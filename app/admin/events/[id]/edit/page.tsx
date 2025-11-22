import { getEventById } from "@/lib/supabase/events";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id, true);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Edit Event</h1>
        <EventForm event={event} />
      </div>
    </div>
  );
}

