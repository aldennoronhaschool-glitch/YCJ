import { NextRequest, NextResponse } from "next/server";
import { getEventRegistrationFields } from "@/lib/supabase/event-registration-fields";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get("event_id");

        if (!eventId) {
            return NextResponse.json(
                { message: "event_id is required" },
                { status: 400 }
            );
        }

        const fields = await getEventRegistrationFields(eventId);
        return NextResponse.json(fields);
    } catch (error: any) {
        console.error("Error fetching event registration fields:", error);
        return NextResponse.json(
            { message: error.message || "Failed to fetch fields" },
            { status: 500 }
        );
    }
}
