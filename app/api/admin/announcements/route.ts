import { isAdmin } from "@/lib/auth";
import { createAnnouncement } from "@/lib/supabase/announcements";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    const announcement = await createAnnouncement({
      title: title.trim(),
      content: content.trim(),
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/announcements:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

