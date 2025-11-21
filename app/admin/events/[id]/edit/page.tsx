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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Edit Event</h1>
        <EventForm event={event} />
      </div>
    </div>
  );
}

