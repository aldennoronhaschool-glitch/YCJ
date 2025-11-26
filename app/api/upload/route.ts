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

    // Determine folder path
    let folderPath = folder || "uploads";

    // Special handling for office bearers - upload to Supabase Storage
    if (folder === "office-bearers") {
      const supabase = createAdminClient();

      // Check if bucket exists, create if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === "office-bearers");

      if (!bucketExists) {
        console.log("Creating office-bearers bucket...");
        const { error: bucketError } = await supabase.storage.createBucket("office-bearers", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });

        if (bucketError) {
          console.error("Failed to create bucket:", bucketError);
          throw new Error(`Failed to create bucket: ${bucketError.message}`);
        }
      }

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

      // Upload to 'office-bearers' bucket
      const { data, error } = await supabase.storage
        .from("office-bearers")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        throw new Error(`Supabase upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("office-bearers")
        .getPublicUrl(fileName);

      return NextResponse.json({ url: publicUrl });
    }

    if (folder === "gallery") {
      if (customEventName) {
        // Sanitize folder name: remove special chars, replace spaces with underscores
        // ImageKit allows: Alphanumeric, underscore, hyphen, space, period
        const sanitizedEventName = customEventName
          .trim()
          .replace(/[^a-zA-Z0-9\s\-_.]/g, "") // Remove invalid chars
          .replace(/\s+/g, "_"); // Replace spaces with underscores

        folderPath = `gallery/${sanitizedEventName}`;
      } else if (eventId) {
        // You might want to fetch the event name here for better folder names
        folderPath = `gallery/event-${eventId}`;
      } else {
        folderPath = "gallery/uncategorized";
      }
    }

    console.log("Uploading to ImageKit folder:", folderPath);

    // Upload to ImageKit
    const uploadResponse = await new Promise((resolve, reject) => {
      imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder: folderPath,
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

