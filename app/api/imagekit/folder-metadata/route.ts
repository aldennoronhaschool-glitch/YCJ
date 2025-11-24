import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertFolderMetadata, getAllFolderMetadata } from "@/lib/supabase/folder-metadata";

export async function POST(request: Request) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { folderName, description } = await request.json();

        if (!folderName) {
            return NextResponse.json(
                { message: "Folder name is required" },
                { status: 400 }
            );
        }

        await upsertFolderMetadata(folderName, description);

        return NextResponse.json({ message: "Folder metadata saved successfully" });
    } catch (error: any) {
        console.error("Error saving folder metadata:", error);
        return NextResponse.json(
            { message: error.message || "Failed to save folder metadata" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const metadata = await getAllFolderMetadata();
        return NextResponse.json({ metadata });
    } catch (error: any) {
        console.error("Error fetching folder metadata:", error);
        return NextResponse.json(
            { message: error.message || "Failed to fetch folder metadata" },
            { status: 500 }
        );
    }
}
