import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { createCompetition } from "@/lib/supabase/competitions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const competition = await createCompetition(body);

    return NextResponse.json(competition, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

