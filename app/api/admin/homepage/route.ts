import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { updateHomepageSettings } from "@/lib/supabase/homepage";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    
    // Convert settings object to the format expected by updateHomepageSettings
    const settings: Record<string, { value: string; type?: string }> = {};
    
    Object.entries(body).forEach(([key, value]) => {
      if (key.includes("image")) {
        settings[key] = { value: value as string, type: "image" };
      } else {
        settings[key] = { value: value as string, type: "text" };
      }
    });

    await updateHomepageSettings(settings);

    return NextResponse.json({ message: "Settings updated" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

