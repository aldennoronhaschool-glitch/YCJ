import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteEventRegistration } from "@/lib/supabase/event-registrations";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await isAdmin();

        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await deleteEventRegistration(id);

        return NextResponse.json({ message: "Registration deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting event registration:", error);
        return NextResponse.json(
            { message: error.message || "Failed to delete registration" },
            { status: 500 }
        );
    }
}
