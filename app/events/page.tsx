import { getAllEvents } from "@/lib/supabase/events";
import { Navbar } from "@/components/navbar";
import { EventsList } from "@/components/events-list";

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
            <p className="text-gray-600">Join us for these exciting gatherings</p>
          </div>

          <EventsList events={events} />
        </div>
      </div>
    </>
  );
}
