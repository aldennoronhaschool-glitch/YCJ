import { NextRequest, NextResponse } from "next/server";
import { createEventRegistration } from "@/lib/supabase/event-registrations";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.event_id || !body.user_id) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const registration = await createEventRegistration(body);

        return NextResponse.json(registration, { status: 201 });
    } catch (error: any) {
        console.error("Error creating event registration:", error);
        return NextResponse.json(
            { message: error.message || "Failed to register" },
            { status: 500 }
        );
    }
}
