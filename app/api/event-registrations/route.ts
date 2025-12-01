import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createEventRegistration } from "@/lib/supabase/event-registrations";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            email,
                phone,
                age: parseInt(age),
                    additional_info: additional_info || null,
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
