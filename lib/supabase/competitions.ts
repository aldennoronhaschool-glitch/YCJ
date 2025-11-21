import { createClient } from "./server";

export interface Competition {
  id: string;
  title: string;
  description: string;
  event_id: string | null;
  max_participants: number | null;
  created_at: string;
}

export async function getAllCompetitions(): Promise<Competition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching competitions:", error);
    return [];
  }

  return data || [];
}

export async function getCompetitionById(id: string): Promise<Competition | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching competition:", error);
    return null;
  }

  return data;
}

export async function createCompetition(competition: Omit<Competition, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .insert([competition])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateCompetition(id: string, competition: Partial<Competition>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .update(competition)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCompetition(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("competitions").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

