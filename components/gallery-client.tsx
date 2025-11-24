"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/supabase/gallery";
import { Event } from "@/lib/supabase/events";
import { Select } from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

export function GalleryClient({
  images,
  events,
}: {
  images: GalleryImage[];
  events: Event[];
}) {
  const searchParams = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Extract unique custom folders
  const customFolders = Array.from(new Set(
    images
      .filter(img => img.custom_event_name)
      .map(img => img.custom_event_name as string)
  )).sort();

  useEffect(() => {
    const eventId = searchParams.get("event");
    const folderName = searchParams.get("folder");

    if (eventId) {
      setSelectedFilter(eventId);
    } else if (folderName) {
      setSelectedFilter(`custom:${folderName}`);
    }
  }, [searchParams]);

  const filteredImages =
    selectedFilter === "all"
      ? images
      : selectedFilter.startsWith("custom:")
        ? images.filter((img) => img.custom_event_name === selectedFilter.replace("custom:", ""))
        : images.filter((img) => img.event_id === selectedFilter);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-gray-600">Memories from our events</p>
        </div>

        <div className="mb-8 flex justify-center">
          <Select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-64 bg-white border-gray-300"
          >
            <option value="all">All Photos</option>
            <optgroup label="Events">
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </optgroup>
            {customFolders.length > 0 && (
              <optgroup label="Other Folders">
                {customFolders.map((folder) => (
                  <option key={folder} value={`custom:${folder}`}>
                    {folder}
                  </option>
                ))}
              </optgroup>
            )}
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
                className="relative mb-4 break-inside-avoid rounded-lg overflow-hidden group cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow"
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

