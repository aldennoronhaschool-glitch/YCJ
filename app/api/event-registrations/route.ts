import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createEventRegistration } from "@/lib/supabase/event-registrations";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { user_id, event_id, custom_fields } = body;

        // Extract standard fields from custom_fields if they exist
        const standardFields: any = {
            name: null,
            email: null,
            phone: null,
            age: null,
        };

        const remainingCustomFields: Record<string, any> = {};

        // Check custom_fields for standard field names
        if (custom_fields) {
            Object.keys(custom_fields).forEach((key) => {
                const lowerKey = key.toLowerCase();
                if (lowerKey === 'name') {
                    standardFields.name = custom_fields[key];
                } else if (lowerKey === 'email') {
                    standardFields.email = custom_fields[key];
                } else if (lowerKey === 'phone' || lowerKey === 'phone number') {
                    standardFields.phone = custom_fields[key];
                } else if (lowerKey === 'age') {
                    standardFields.age = custom_fields[key] ? parseInt(custom_fields[key]) : null;
                } else {
                    // Keep as custom field
                    remainingCustomFields[key] = custom_fields[key];
                }
            });
        }

        const registration = await createEventRegistration({
            user_id,
            event_id,
            ...standardFields,
            custom_fields: remainingCustomFields,
        });

        return NextResponse.json(registration, { status: 201 });
    } catch (error: any) {
        console.error("Error creating event registration:", error);
        return NextResponse.json(
            { message: error.message || "Failed to create registration" },
            { status: 500 }
        );
    }
}
