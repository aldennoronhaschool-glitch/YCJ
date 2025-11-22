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
    service_times_enabled: "true",
    // Service Times
    service_1_label: "1st Service",
    service_1_time: "8 AM",
    service_2_label: "2nd Service",
    service_2_time: "10:00 AM",
    service_3_label: "3rd Service",
    service_3_time: "12:00 PM",
    service_4_label: "4th Service",
    service_4_time: "6 PM",
    service_language: "ALL SERVICES IN ENGLISH",
    // Welcome Note
    welcome_note: `This life is a beautiful gift of God. Life can get both fair and unfair at times. We find ourselves fighting battles (some meaningful and some meaningless) and believe they are here to stay. Many call life a race and some don't even know why they are running it. In the midst of it all, we pray that God's pure light would lead your way and you would know He truly cares.

We pray that God would provide for you the comfort and strength He has promised His children and that you would discover the freedom in trusting the One who will never let you down. The Lord builds both our character and competence for HIS glory in us.

God has been gracious and we are here not by our strength but by His faithfulness. He built the Youth of Christha Jyothi brick by brick while we stood lifting our hands in worship. Our prayer is that this family at YCJ would abound in God's love, goodness, and grace. We pray that you would find God in this kingdom to place and time of your life. There is hope and rest in Him for all who are Seeking. We pray you wouldn't miss it.`,
    welcome_note_signature: "Youth of Christha Jyothi Leadership",
    // Contact Information
    contact_email: "info@ycjchurch.org",
    contact_phone: "+91 (XX) XXXX XXXX",
    contact_phone_hours: "Tuesday to Sunday",
    contact_office_hours: "10:00am to 6:00pm",
    contact_office_days: "Tuesday to Sunday",
    contact_address_line1: "CSI Christha Jyothi Church",
    contact_address_line2: "Bangalore, Karnataka",
    // Social Media
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
    social_whatsapp: "",
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

