import { createClient } from "./server";

export interface EventRegistration {
    id: string;
    event_id: string;
    user_id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    age?: number | null;
    additional_info?: string | null;
    custom_fields?: Record<string, any>;
    created_at: string;
}

export async function createEventRegistration(registration: Omit<EventRegistration, "id" | "created_at">) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_registrations")
        .insert([registration])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getAllEventRegistrations(): Promise<EventRegistration[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching event registrations:", error);
        return [];
    }

    return data || [];
}

export async function getEventRegistrationsByEvent(eventId: string): Promise<EventRegistration[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching event registrations:", error);
        return [];
    }

    return data || [];
}

export async function deleteEventRegistration(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("event_registrations").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}
