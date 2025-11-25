import { createClient } from "./server";
import { createAdminClient } from "./admin";

export interface ContactSettings {
    [key: string]: string;
}

export async function getContactSettings(): Promise<ContactSettings> {
    const defaultSettings: ContactSettings = {
        telephone: "+91 (80) 6753 7777",
        telephone_hours: "Tuesday to Sunday",
        email: "info@ycjchurch.org",
        office_hours: "10:00am to 6:00pm",
        office_days: "Tuesday to Sunday",
        address_line1: "CSI Christa Jyothi Church",
        address_line2: "Bima Nagar, Bailoor, Udupi",
        address_line3: "Karnataka 576101",
        map_embed_url: "",
        facebook_url: "",
        twitter_url: "",
        instagram_url: "",
        youtube_url: "",
        app_store_url: "",
        play_store_url: "",
        hero_title: "Contact Us",
        hero_subtitle: "Get in touch with us",
    };

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("contact_settings")
            .select("*");

        if (error) {
            console.error("Error fetching contact settings:", {
                message: error.message,
                code: error.code,
            });
            return defaultSettings;
        }

        if (!data || data.length === 0) {
            return defaultSettings;
        }

        const settings: ContactSettings = { ...defaultSettings };
        data.forEach((setting) => {
            if (setting.value !== null && setting.value !== undefined) {
                settings[setting.key] = setting.value;
            }
        });

        return settings;
    } catch (error: any) {
        console.error("Exception fetching contact settings:", error?.message || error);
        return defaultSettings;
    }
}

// Public version that doesn't use cookies - safe for static generation
export async function getContactSettingsPublic(): Promise<ContactSettings> {
    const defaultSettings: ContactSettings = {
        telephone: "+91 (80) 6753 7777",
        telephone_hours: "Tuesday to Sunday",
        email: "info@ycjchurch.org",
        office_hours: "10:00am to 6:00pm",
        office_days: "Tuesday to Sunday",
        address_line1: "CSI Christa Jyothi Church",
        address_line2: "Bima Nagar, Bailoor, Udupi",
        address_line3: "Karnataka 576101",
        map_embed_url: "",
        facebook_url: "",
        twitter_url: "",
        instagram_url: "",
        youtube_url: "",
        app_store_url: "",
        play_store_url: "",
        hero_title: "Contact Us",
        hero_subtitle: "Get in touch with us",
    };

    // During build time, return default settings to avoid database calls
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return defaultSettings;
    }

    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("contact_settings")
            .select("*");

        if (error) {
            console.error("Error fetching contact settings:", {
                message: error.message,
                code: error.code,
            });
            return defaultSettings;
        }

        if (!data || data.length === 0) {
            return defaultSettings;
        }

        const settings: ContactSettings = { ...defaultSettings };
        data.forEach((setting) => {
            if (setting.value !== null && setting.value !== undefined) {
                settings[setting.key] = setting.value;
            }
        });

        return settings;
    } catch (error: any) {
        console.error("Exception fetching contact settings:", error?.message || error);
        return defaultSettings;
    }
}

export async function updateContactSetting(key: string, value: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("contact_settings")
        .upsert(
            {
                key,
                value,
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

export async function updateContactSettings(settings: Record<string, string>) {
    const supabase = createAdminClient();
    const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
        .from("contact_settings")
        .upsert(updates, { onConflict: "key" })
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
