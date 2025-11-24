import { GalleryViewImageKit } from "@/components/gallery-view-imagekit";
import { Navbar } from "@/components/navbar";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  return (
    <>
      <Navbar />
      <GalleryViewImageKit />
    </>
  );
}
