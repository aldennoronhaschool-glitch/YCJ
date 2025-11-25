import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ folderPath: string }> }
) {
    try {
        // Check authentication
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { folderPath } = await params;
        // Decode the folder path (it will be URL encoded)
        const decodedPath = decodeURIComponent(folderPath);

        // Ensure we are deleting from the gallery directory and not root
        if (!decodedPath || decodedPath === '/' || !decodedPath.startsWith('gallery/')) {
            return NextResponse.json({ error: "Invalid folder path" }, { status: 400 });
        }

        console.log(`Attempting to delete folder: ${decodedPath}`);

        // 1. Delete folder from ImageKit
        // ImageKit's deleteFolder API requires the full path
        await new Promise((resolve, reject) => {
            imagekit.deleteFolder(decodedPath, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        // 2. Delete folder metadata from Supabase
        // We need to extract the folder name from the path (e.g., "gallery/MyFolder" -> "MyFolder")
        const folderName = decodedPath.split('/').pop();

        if (folderName) {
            const supabase = await createClient();
            const { error: dbError } = await supabase
                .from("gallery_folders")
                .delete()
                .eq("folder_name", folderName);

            if (dbError) {
                console.error("Error deleting folder metadata:", dbError);
                // We continue even if DB delete fails, as the main asset (ImageKit folder) is gone
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting folder:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete folder" },
            { status: 500 }
        );
    }
}
