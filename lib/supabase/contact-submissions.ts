import { createClient } from "./server";
import { createAdminClient } from "./admin";

export interface ContactSubmission {
    id: string;
    first_name: string;
    last_name: string;
    gender: 'male' | 'female';
    email: string;
    phone: string;
    city: string;
    connection: 'member' | 'attending' | 'online-other' | 'online-only' | 'none';
    message_title: string;
    message_body: string;
    status: 'unread' | 'read' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface ContactSubmissionInput {
    first_name: string;
    last_name: string;
    gender: 'male' | 'female';
    email: string;
    phone: string;
    city: string;
    connection: 'member' | 'attending' | 'online-other' | 'online-only' | 'none';
    message_title: string;
    message_body: string;
}

// Submit a new contact form (public - no auth required)
export async function submitContactForm(data: ContactSubmissionInput): Promise<ContactSubmission> {
    const supabase = createAdminClient();

    const { data: submission, error } = await supabase
        .from("contact_submissions")
        .insert({
            ...data,
            status: 'unread',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error("Error submitting contact form:", error);
        throw new Error(error.message);
    }

    return submission;
}

// Get all contact submissions (admin only) - FIXED: Now uses admin client
export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching contact submissions:", error);
        throw new Error(error.message);
    }

    return data || [];
}

// Get contact submission by ID (admin only) - FIXED: Now uses admin client
export async function getContactSubmissionById(id: string): Promise<ContactSubmission | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching contact submission:", error);
        return null;
    }

    return data;
}

// Update contact submission status (admin only)
export async function updateContactSubmissionStatus(
    id: string,
    status: 'unread' | 'read' | 'archived'
): Promise<ContactSubmission> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("contact_submissions")
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating contact submission:", error);
        throw new Error(error.message);
    }

    return data;
}

// Delete contact submission (admin only)
export async function deleteContactSubmission(id: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting contact submission:", error);
        throw new Error(error.message);
    }
}

// Get submission statistics - FIXED: Now uses admin client
export async function getContactSubmissionStats() {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("contact_submissions")
        .select("status");

    if (error) {
        console.error("Error fetching submission stats:", error);
        return { total: 0, unread: 0, read: 0, archived: 0 };
    }

    const stats = {
        total: data.length,
        unread: data.filter(s => s.status === 'unread').length,
        read: data.filter(s => s.status === 'read').length,
        archived: data.filter(s => s.status === 'archived').length,
    };

    return stats;
}
