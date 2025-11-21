import { auth } from "@clerk/nextjs/server";
import { createRegistration } from "@/lib/supabase/registrations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId || null;
    } catch (authError) {
      console.error("Auth error:", authError);
      // If auth fails, return unauthorized
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { competition_id, name, phone, age, team_name, payment_mode } = body;

    if (!competition_id || !name || !phone || !age) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const registration = await createRegistration({
      user_id: userId,
      competition_id,
      name,
      phone,
      age: parseInt(age),
      team_name: team_name || null,
      payment_mode: payment_mode || null,
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

