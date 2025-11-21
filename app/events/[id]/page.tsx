import { notFound } from "next/navigation";
import { getEventById } from "@/lib/supabase/events";
import { getGalleryImages } from "@/lib/supabase/gallery";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);
  const galleryImages = await getGalleryImages(params.id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {event.banner_url && (
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
            <Image
              src={event.banner_url}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{event.time}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
        </div>

        {galleryImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image.image_url}
                    alt="Event photo"
                    fill
                    className="object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

