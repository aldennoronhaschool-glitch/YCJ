import { NextRequest, NextResponse } from "next/server";
import { updateAboutSection, deleteAboutSection } from "@/lib/supabase/about";
import { isAdmin } from "@/lib/auth";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { id: bodyId, created_at, updated_at, ...updates } = body;

        const section = await updateAboutSection(id, updates);
        return NextResponse.json(section);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update section" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await deleteAboutSection(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to delete section" },
            { status: 500 }
        );
    }
}
