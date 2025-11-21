import { createClient } from "./server";

export interface OfficeBearer {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  order_index: number;
  created_at: string;
}

export async function getOfficeBearers(): Promise<OfficeBearer[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("office_bearers")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      // If table missing, just return empty list
      if (
        error.code === "42P01" ||
        error.message?.includes("does not exist") ||
        error.message?.includes("Could not find the table")
      ) {
        return [];
      }
      console.error("Error fetching office bearers:", error.message || error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching office bearers:", error);
    return [];
  }
}

export async function createOfficeBearer(
  bearer: Omit<OfficeBearer, "id" | "created_at">
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("office_bearers")
    .insert([bearer])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateOfficeBearer(
  id: string,
  bearer: Partial<Omit<OfficeBearer, "id" | "created_at">>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("office_bearers")
    .update(bearer)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteOfficeBearer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("office_bearers")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}


