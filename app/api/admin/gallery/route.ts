import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { getGalleryImages } from "@/lib/supabase/gallery";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const images = await getGalleryImages();

        return NextResponse.json({ images });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
