import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { fileId } = await params;

        // Delete from ImageKit
        await new Promise((resolve, reject) => {
            imagekit.deleteFile(fileId, (error, result) => {
                if (error) {
                    console.error("ImageKit delete error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        return NextResponse.json({ message: "Image deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            { message: error.message || "Failed to delete image" },
            { status: 500 }
        );
    }
}
