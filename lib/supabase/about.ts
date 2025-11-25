import { createClient } from "./server";
import { createAdminClient } from "./admin";

export interface AboutSection {
    id: string;
    section_key: string;
    title: string | null;
    content: string | null;
    image_url: string | null;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export async function getAboutSections(): Promise<AboutSection[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("about_us")
            .select("*")
            .order("order_index", { ascending: true });

        if (error) {
            console.error("Error fetching about sections:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            });
            return [];
        }

        return data || [];
    } catch (error: any) {
        console.error("Exception fetching about sections:", error?.message || error);
        return [];
    }
}

// Public version that doesn't use cookies - safe for static generation
export async function getAboutSectionsPublic(): Promise<AboutSection[]> {
    // During build time, return empty array to avoid database calls
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return [];
    }

    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("about_us")
            .select("*")
            .order("order_index", { ascending: true });

        if (error) {
            console.error("Error fetching about sections:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            });
            return [];
        }

        return data || [];
    } catch (error: any) {
        console.error("Exception fetching about sections:", error?.message || error);
        return [];
    }
}

export async function getAboutSection(sectionKey: string): Promise<AboutSection | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("about_us")
            .select("*")
            .eq("section_key", sectionKey)
            .single();

        if (error) {
            console.error(`Error fetching about section ${sectionKey}:`, error);
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Error fetching about section ${sectionKey}:`, error);
        return null;
    }
}

export async function updateAboutSection(
    id: string,
    updates: Partial<Omit<AboutSection, "id" | "created_at" | "updated_at">>
) {
    // Use admin client to bypass RLS
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("about_us")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createAboutSection(
    section: Omit<AboutSection, "id" | "created_at" | "updated_at">
) {
    // Use admin client to bypass RLS
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("about_us")
        .insert([section])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteAboutSection(id: string) {
    // Use admin client to bypass RLS
    const supabase = createAdminClient();
    const { error } = await supabase.from("about_us").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}
