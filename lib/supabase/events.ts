import { createClient } from "./server";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  banner_url: string | null;
  published: boolean;
  created_at: string;
}

export async function getLatestEvents(limit: number = 10): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data || [];
}

export async function getAllEvents(includeUnpublished: boolean = false): Promise<Event[]> {
  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data || [];
}

export async function getEventById(id: string, includeUnpublished: boolean = false): Promise<Event | null> {
  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select("*")
    .eq("id", id);

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data;
}

export async function createEvent(event: Omit<Event, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert([event])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateEvent(id: string, event: Partial<Event>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

