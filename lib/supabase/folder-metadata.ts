import { createClient } from "./server";

export interface FolderMetadata {
    id: string;
    folder_name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export async function getFolderMetadata(folderName: string): Promise<FolderMetadata | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("gallery_folders")
        .select("*")
        .eq("folder_name", folderName)
        .single();

    if (error) {
        console.error("Error fetching folder metadata:", error);
        return null;
    }

    return data;
}

export async function getAllFolderMetadata(): Promise<FolderMetadata[]> {
    // Since we're using ImageKit for gallery storage, we don't need folder metadata from the database
    // Return empty array to avoid errors
    return [];
}

export async function upsertFolderMetadata(
    folderName: string,
    description: string | null
): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("gallery_folders")
        .upsert(
            {
                folder_name: folderName,
                description: description,
                updated_at: new Date().toISOString(),
            },
            {
                onConflict: "folder_name",
            }
        );

    if (error) {
        throw new Error(error.message);
    }
}
