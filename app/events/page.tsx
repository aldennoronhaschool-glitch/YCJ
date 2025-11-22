import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { getAllEvents } from "@/lib/supabase/events";
import Image from "next/image";
import { Navbar } from "@/components/navbar";

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

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events scheduled at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                {event.banner_url && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.banner_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-gray-600">
                    {event.description}
                  </CardDescription>
                  {event.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

