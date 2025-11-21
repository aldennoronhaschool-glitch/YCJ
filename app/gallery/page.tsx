import { getGalleryImages } from "@/lib/supabase/gallery";
import { getAllEvents } from "@/lib/supabase/events";
import { GalleryClient } from "@/components/gallery-client";
import { Navbar } from "@/components/navbar";

export default async function GalleryPage() {
  const allImages = await getGalleryImages();
  const events = await getAllEvents();

  return (
    <>
      <Navbar />
      <GalleryClient images={allImages} events={events} />
    </>
  );
}

