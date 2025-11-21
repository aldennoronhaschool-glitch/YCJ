import { createClient } from "./server";

export interface GalleryImage {
  id: string;
  event_id: string | null;
  image_url: string;
  created_at: string;
}

export async function getGalleryImages(eventId?: string): Promise<GalleryImage[]> {
  const supabase = await createClient();
  let query = supabase.from("gallery").select("*").order("created_at", { ascending: false });

  if (eventId) {
    query = query.eq("event_id", eventId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }

  return data || [];
}

export async function uploadGalleryImage(image: Omit<GalleryImage, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .insert([image])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteGalleryImage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

