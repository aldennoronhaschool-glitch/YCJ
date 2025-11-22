import { getGalleryImages } from "@/lib/supabase/gallery";
import { getAllEvents } from "@/lib/supabase/events";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Gallery Management</h1>
        <GalleryManager initialImages={images} events={events} />
      </div>
    </div>
  );
}

