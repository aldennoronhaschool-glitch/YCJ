import { NextRequest, NextResponse } from "next/server";
import { getAboutSections } from "@/lib/supabase/about";
import { isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const sections = await getAboutSections();
        return NextResponse.json(sections);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch sections" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { createAboutSection } = await import("@/lib/supabase/about");

        const section = await createAboutSection(body);
        return NextResponse.json(section);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create section" },
            { status: 500 }
        );
    }
}
