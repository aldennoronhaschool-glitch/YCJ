import { EventForm } from "@/components/admin/event-form";

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Event</h1>
        <EventForm />
      </div>
    </div>
  );
}

