import { EventForm } from "@/components/admin/event-form";

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Create New Event</h1>
        <EventForm />
      </div>
    </div>
  );
}

