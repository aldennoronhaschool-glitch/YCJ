import { createClient } from "./server";
import { createAdminClient } from "./admin";

export interface EventRegistrationField {
    id: string;
    event_id: string;
    field_label: string;
    field_type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select';
    field_options: string[] | null;
    is_required: boolean;
    field_order: number;
    created_at: string;
}

export async function getEventRegistrationFields(eventId: string): Promise<EventRegistrationField[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("event_registration_fields")
            .select("*")
            .eq("event_id", eventId)
            .order("field_order", { ascending: true });

        if (error) {
            console.error("Error fetching event registration fields:", error);
            console.error("Event ID:", eventId);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Error fetching event registration fields:", error);
        return [];
    }
}

export async function createEventRegistrationField(field: Omit<EventRegistrationField, "id" | "created_at">) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("event_registration_fields")
        .insert([field])
        .select()
        .single();

    if (error) {
        console.error("Error creating event registration field:", error);
        console.error("Field data:", field);
        throw new Error(error.message);
    }

    return data;
}

export async function updateEventRegistrationField(id: string, field: Partial<EventRegistrationField>) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("event_registration_fields")
        .update(field)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteEventRegistrationField(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from("event_registration_fields")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}

export async function updateFieldsOrder(fields: { id: string; field_order: number }[]) {
    const supabase = createAdminClient();

    const updates = fields.map(field =>
        supabase
            .from("event_registration_fields")
            .update({ field_order: field.field_order })
            .eq("id", field.id)
    );

    await Promise.all(updates);
}
