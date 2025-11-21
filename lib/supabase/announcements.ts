import { createClient } from "./server";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export async function getAnnouncements(limit: number = 10): Promise<Announcement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  return data || [];
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  return data || [];
}

export async function createAnnouncement(announcement: Omit<Announcement, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .insert([announcement])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateAnnouncement(id: string, announcement: Partial<Announcement>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .update(announcement)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

