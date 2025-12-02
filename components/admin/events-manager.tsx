"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/lib/supabase/events";
import { Edit, Trash2, Eye, EyeOff, Users, Settings, Plus } from "lucide-react";
import Link from "next/link";

export function EventsManager({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents(events.filter((e) => e.id !== id));
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (event: Event) => {
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !event.published }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updated = await response.json();
      setEvents(events.map((e) => (e.id === event.id ? updated : e)));
      toast({
        title: "Event updated",
        description: `Event ${updated.published ? "published" : "unpublished"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No events found. Create your first event!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex flex-wrap items-center gap-2">
                      <span className="break-words">{event.title}</span>
                      {!event.published && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded whitespace-nowrap">
                          Draft
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </CardDescription>
                  </div>

                  {/* Desktop: Icon buttons in a row */}
                  <div className="hidden md:flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleTogglePublish(event)}
                      title={event.published ? "Unpublish" : "Publish"}
                    >
                      {event.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Manage Registrations">
                      <Link href={`/admin/event-registrations?event=${event.id}`}>
                        <Users className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Customize Registration Form">
                      <Link href={`/admin/events/${event.id}/registration-fields`}>
                        <Settings className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Mobile: Buttons with text labels in a grid */}
                  <div className="grid grid-cols-2 gap-2 md:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(event)}
                      className="justify-start"
                    >
                      {event.published ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Publish
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" asChild className="justify-start">
                      <Link href={`/admin/event-registrations?event=${event.id}`}>
                        <Users className="w-4 h-4 mr-2" />
                        Registrations
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="justify-start">
                      <Link href={`/admin/events/${event.id}/registration-fields`}>
                        <Settings className="w-4 h-4 mr-2" />
                        Form Fields
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="justify-start">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="justify-start col-span-2"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Event
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.banner_url && (
                  <div
                    className="rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage(event.banner_url!)}
                  >
                    <img
                      src={event.banner_url}
                      alt={event.title}
                      className="w-full h-40 md:h-48 object-cover"
                    />
                  </div>
                )}
                <p className="text-sm md:text-base text-gray-600 line-clamp-3">{event.description}</p>
                {event.location && (
                  <p className="text-sm text-gray-500">📍 {event.location}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Event Button at Bottom */}
      <div className="mt-6 flex justify-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/admin/events/new">
            <Plus className="w-5 h-5 mr-2" />
            Add New Event
          </Link>
        </Button>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors text-4xl"
          >
            ×
          </button>
          <img
            src={lightboxImage}
            alt="Event banner"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

