import { createClient } from "./server";
import { createAdminClient } from "./admin";

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

// Public version that doesn't use cookies - safe for static generation
export async function getOfficeBearersPublic(): Promise<OfficeBearer[]> {
  try {
    const supabase = createAdminClient();
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
  bearer: Omit<OfficeBearer, "id" | "created_at" | "order_index"> & { order_index?: number }
) {
  // Use admin client to bypass RLS
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (clientError: any) {
    console.error("Error creating admin client:", clientError);
    throw new Error(
      `Failed to create admin client: ${clientError.message}. Make sure SUPABASE_SERVICE_ROLE_KEY is set in your environment variables.`
    );
  }

  // Get the max order_index to place new bearer at the end
  const { data: existing, error: orderError } = await supabase
    .from("office_bearers")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If table doesn't exist or no data, start at 0
  const maxOrder = orderError || !existing ? -1 : (existing.order_index ?? -1);
  const newOrderIndex = maxOrder + 1;

  const { data, error } = await supabase
    .from("office_bearers")
    .insert([{
      ...bearer,
      order_index: bearer.order_index ?? newOrderIndex,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating office bearer:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      error: error,
    });
    throw new Error(
      error.message ||
      error.details ||
      `Failed to create office bearer: ${error.code || "Unknown error"}`
    );
  }

  if (!data) {
    throw new Error("Office bearer created but no data returned");
  }

  return data;
}

export async function updateOfficeBearer(
  id: string,
  bearer: Partial<Omit<OfficeBearer, "id" | "created_at">>
) {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("office_bearers")
    .update(bearer)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating office bearer:", error);
    throw new Error(error.message || "Failed to update office bearer");
  }

  return data;
}

export async function deleteOfficeBearer(id: string) {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("office_bearers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting office bearer:", error);
    throw new Error(error.message || "Failed to delete office bearer");
  }
}


