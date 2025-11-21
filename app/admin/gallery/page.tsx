import { getGalleryImages } from "@/lib/supabase/gallery";
import { getAllEvents } from "@/lib/supabase/events";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Gallery Management</h1>
        <GalleryManager initialImages={images} events={events} />
      </div>
    </div>
  );
}

