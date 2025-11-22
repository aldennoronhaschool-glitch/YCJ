import { isAdmin } from "@/lib/auth";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/supabase/announcements";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    const announcement = await updateAnnouncement(id, {
      title: title.trim(),
      content: content.trim(),
    });

    return NextResponse.json(announcement);
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/announcements/[id]:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await deleteAnnouncement(id);

    return NextResponse.json({ message: "Announcement deleted" });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/announcements/[id]:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

