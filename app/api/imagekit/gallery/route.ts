import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { getAllFolderMetadata } from "@/lib/supabase/folder-metadata";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function GET() {
    try {
        // List ALL files (no path filter)
        const files = await new Promise<any[]>((resolve, reject) => {
            imagekit.listFiles(
                {
                    skip: 0,
                    limit: 1000,
                },
                (error, result) => {
                    if (error) {
                        console.error("ImageKit listFiles error:", error);
                        reject(error);
                    } else {
                        console.log("Total ImageKit files found:", result?.length || 0);
                        resolve(result || []);
                    }
                }
            );
        });

        console.log("All files from ImageKit:", files.map(f => f.filePath));

        // Filter only gallery files and group by folder
        const folderMap = new Map<string, any[]>();

        files.forEach((file) => {
            const filePath = file.filePath || "";
            console.log("Processing file path:", filePath);

            // Only process files in /gallery/ folder
            if (filePath.includes('/gallery/')) {
                // Extract folder name from path like "/gallery/FolderName/image.jpg"
                const pathParts = filePath.split('/').filter(Boolean);

                // Find the index of 'gallery' and get the next part as folder name
                const galleryIndex = pathParts.indexOf('gallery');

                // We need at least: gallery -> FolderName -> FileName
                // So length must be > galleryIndex + 2
                if (galleryIndex !== -1 && pathParts.length > galleryIndex + 2) {
                    const folderName = pathParts[galleryIndex + 1];

                    if (!folderMap.has(folderName)) {
                        folderMap.set(folderName, []);
                    }
                    folderMap.get(folderName)?.push({
                        id: file.fileId,
                        url: file.url,
                        name: file.name,
                        thumbnail: file.thumbnail || file.url,
                    });
                }
            }
        });

        // Fetch folder metadata from Supabase
        const metadata = await getAllFolderMetadata();
        const metadataMap = new Map(metadata.map(m => [m.folder_name, m.description]));

        // Convert to folders array with metadata
        const folders = Array.from(folderMap.entries()).map(([name, images]) => ({
            id: name,
            name: name,
            coverImage: images[0]?.url || '',
            count: images.length,
            images: images,
            description: metadataMap.get(name) || null,
        }));

        console.log("Folders created:", folders.length);
        console.log("Folder details:", folders.map(f => ({ name: f.name, count: f.count })));

        return NextResponse.json({
            folders,
            totalFiles: files.length,
            galleryFiles: files.filter(f => f.filePath?.includes('/gallery/')).length
        });
    } catch (error: any) {
        console.error("Error fetching from ImageKit:", error);
        return NextResponse.json(
            {
                message: error.message || "Failed to fetch images",
                error: error.toString(),
            },
            { status: 500 }
        );
    }
}
