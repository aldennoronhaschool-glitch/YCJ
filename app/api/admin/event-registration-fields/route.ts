import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createEventRegistrationField } from "@/lib/supabase/event-registration-fields";

export async function POST(request: NextRequest) {
    try {
        const admin = await isAdmin();

        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { event_id, field_label, field_type, is_required, field_options, field_order } = body;

        if (!event_id || !field_label || !field_type || field_order === undefined) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const field = await createEventRegistrationField({
            event_id,
            field_label,
            field_type,
            is_required: is_required ?? true,
            field_options: field_options || null,
            field_order,
        });

        return NextResponse.json(field, { status: 201 });
    } catch (error: any) {
        console.error("Error creating event registration field:", error);
        return NextResponse.json(
            { message: error.message || "Failed to create field" },
            { status: 500 }
        );
    }
}
