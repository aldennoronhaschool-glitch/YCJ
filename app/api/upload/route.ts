import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;
    const eventId = formData.get("event_id") as string | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const supabase = await createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (uploadError) {
      return NextResponse.json(
        { message: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(filePath);

    // If this is a gallery image, save it to the database
    if (folder === "gallery") {
      const { error: dbError } = await supabase.from("gallery").insert({
        image_url: publicUrl,
        event_id: eventId || null,
      });

      if (dbError) {
        console.error("Error saving gallery image:", dbError);
      }
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

