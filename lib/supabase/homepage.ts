import { createClient } from "./server";

export interface HomepageSetting {
  id: string;
  key: string;
  value: string | null;
  type: string;
  created_at: string;
  updated_at: string;
}

export async function getHomepageSettings(): Promise<Record<string, string>> {
  // Default settings to use if table doesn't exist or query fails
  const defaultSettings: Record<string, string> = {
    hero_title: "Youth of Christha Jyothi",
    hero_subtitle: "CSI Christha Jyothi Church - Building a vibrant community of faith, fellowship, and service",
    hero_background_image: "",
    hero_background_color: "from-blue-50 via-indigo-50 to-purple-50",
    announcements_enabled: "true",
  };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("*");

    // If there's an error (table doesn't exist, RLS issue, etc.), return defaults silently
    if (error) {
      // Check if it's a "table doesn't exist" error
      const isTableMissing = 
        error.code === "42P01" || 
        error.code === "PGRST116" ||
        error.message?.includes("does not exist") ||
        error.message?.includes("relation") ||
        error.message?.includes("permission denied") ||
        error.message?.includes("Could not find the table") ||
        error.message?.includes("schema cache");
      
      // Silently return defaults for missing table - no error logging
      if (isTableMissing) {
        return defaultSettings;
      }
      
      // Only log unexpected errors
      console.error("Error fetching homepage settings:", error.message || error);
      
      // Return defaults on any error
      return defaultSettings;
    }

    // If no data, return defaults
    if (!data || data.length === 0) {
      return defaultSettings;
    }

    // Build settings object from database
    const settings: Record<string, string> = { ...defaultSettings };
    data.forEach((setting) => {
      if (setting.value !== null && setting.value !== undefined) {
        settings[setting.key] = setting.value;
      }
    });

    return settings;
  } catch (error: any) {
    // Silently return defaults on any exception
    return defaultSettings;
  }
}

export async function getHomepageSetting(key: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) {
    console.error(`Error fetching homepage setting ${key}:`, error);
    return null;
  }

  return data?.value || null;
}

export async function updateHomepageSetting(key: string, value: string, type: string = "text") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_settings")
    .upsert(
      {
        key,
        value,
        type,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateHomepageSettings(settings: Record<string, { value: string; type?: string }>) {
  const supabase = await createClient();
  const updates = Object.entries(settings).map(([key, { value, type = "text" }]) => ({
    key,
    value,
    type,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("homepage_settings")
    .upsert(updates, { onConflict: "key" })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

