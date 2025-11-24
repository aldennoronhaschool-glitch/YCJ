import { createClient } from "./server";
import { getAllEvents } from "./events";

export interface GalleryImage {
  id: string;
  event_id: string | null;
  custom_event_name: string | null;
  image_url: string;
  created_at: string;
}

export interface GalleryFolder {
  id: string; // event_id or custom name
  name: string;
  coverImage: string;
  type: 'event' | 'custom';
  count: number;
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

export async function getRecentGalleryFolders(limit = 4): Promise<GalleryFolder[]> {
  const supabase = await createClient();
  const { data: images, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !images) return [];

  const events = await getAllEvents();
  const eventMap = new Map(events.map(e => [e.id, e.title]));

  const foldersMap = new Map<string, GalleryFolder>();

  for (const img of images) {
    let folderId = "";
    let folderName = "";
    let type: 'event' | 'custom' = 'custom';

    if (img.event_id) {
      folderId = img.event_id;
      folderName = eventMap.get(img.event_id) || "Unknown Event";
      type = 'event';
    } else if (img.custom_event_name) {
      folderId = img.custom_event_name;
      folderName = img.custom_event_name;
      type = 'custom';
    } else {
      continue;
    }

    if (!foldersMap.has(folderId)) {
      foldersMap.set(folderId, {
        id: folderId,
        name: folderName,
        coverImage: img.image_url,
        type,
        count: 0
      });
    }
    foldersMap.get(folderId)!.count++;
  }

  return Array.from(foldersMap.values()).slice(0, limit);
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

