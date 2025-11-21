import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { deleteGalleryImage } from "@/lib/supabase/gallery";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await deleteGalleryImage(id);

    return NextResponse.json({ message: "Image deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

