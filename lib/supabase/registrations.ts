import { createClient } from "./server";

export interface Registration {
  id: string;
  user_id: string;
  competition_id: string;
  name: string;
  phone: string;
  age: number;
  team_name: string | null;
  payment_mode: string | null;
  created_at: string;
}

export async function createRegistration(registration: Omit<Registration, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrations")
    .insert([registration])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }

  return data || [];
}

export async function getRegistrationsByCompetition(competitionId: string): Promise<Registration[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("competition_id", competitionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }

  return data || [];
}

