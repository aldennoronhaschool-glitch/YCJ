"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/supabase/gallery";
import { Event } from "@/lib/supabase/events";
import { Select } from "@/components/ui/select";

export function GalleryClient({
  images,
  events,
}: {
  images: GalleryImage[];
  events: Event[];
}) {
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const filteredImages =
    selectedEvent === "all"
      ? images
      : images.filter((img) => img.event_id === selectedEvent);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-gray-600">Memories from our events</p>
        </div>

        <div className="mb-8 flex justify-center">
          <Select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-64"
          >
            <option value="all">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </Select>
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No images found.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative mb-4 break-inside-avoid rounded-lg overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-auto">
                  <Image
                    src={image.image_url}
                    alt="Gallery image"
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

