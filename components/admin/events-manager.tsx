"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/lib/supabase/events";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
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
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {event.title}
                      {!event.published && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
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
                </div>
              </CardHeader>
              <CardContent>
                {event.banner_url && (
                  <div
                    className="mb-4 rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage(event.banner_url!)}
                  >
                    <img
                      src={event.banner_url}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                {event.location && (
                  <p className="text-sm text-gray-500 mt-2">📍 {event.location}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

