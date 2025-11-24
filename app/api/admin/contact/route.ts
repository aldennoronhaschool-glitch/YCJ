import { NextRequest, NextResponse } from "next/server";
import { getContactSettings, updateContactSettings } from "@/lib/supabase/contact";
import { isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const settings = await getContactSettings();
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        await updateContactSettings(body);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update settings" },
            { status: 500 }
        );
    }
}
