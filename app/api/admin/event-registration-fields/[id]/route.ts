import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateEventRegistrationField, deleteEventRegistrationField } from "@/lib/supabase/event-registration-fields";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await isAdmin();

        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const field = await updateEventRegistrationField(id, body);

        return NextResponse.json(field);
    } catch (error: any) {
        console.error("Error updating event registration field:", error);
        return NextResponse.json(
            { message: error.message || "Failed to update field" },
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
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await deleteEventRegistrationField(id);

        return NextResponse.json({ message: "Field deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting event registration field:", error);
        return NextResponse.json(
            { message: error.message || "Failed to delete field" },
            { status: 500 }
        );
    }
}
