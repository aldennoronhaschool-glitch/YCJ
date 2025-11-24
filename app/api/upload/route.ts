import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  console.error("Missing IMAGEKIT_PRIVATE_KEY in environment variables");
}

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
    const customEventName = formData.get("custom_event_name") as string | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer for ImageKit
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to ImageKit
    const uploadResponse = await new Promise((resolve, reject) => {
      imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder: folder || "uploads", // Organize in ImageKit folders
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    const publicUrl = (uploadResponse as any).url;

    // Save metadata to Supabase Database
    const supabase = createAdminClient();

    // If this is a gallery image, save it to the gallery table
    if (folder === "gallery") {
      const { error: dbError } = await supabase.from("gallery").insert({
        image_url: publicUrl,
        event_id: eventId || null,
        custom_event_name: customEventName || null,
      });

      if (dbError) {
        console.error("Error saving gallery image:", dbError);
        // Note: We might want to delete the image from ImageKit if DB insert fails, 
        // but for now we'll just log the error.
      }
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

