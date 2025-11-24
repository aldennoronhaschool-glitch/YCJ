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
