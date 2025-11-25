import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { getAllFolderMetadata } from "@/lib/supabase/folder-metadata";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '4');

        // List ALL files
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
                        resolve(result || []);
                    }
                }
            );
        });

        // Filter and group by folder
        const folderMap = new Map<string, any[]>();

        files.forEach((file) => {
            const filePath = file.filePath || "";

            if (filePath.includes('/gallery/')) {
                const pathParts = filePath.split('/').filter(Boolean);
                const galleryIndex = pathParts.indexOf('gallery');

                // We need at least: gallery -> FolderName -> FileName
                if (galleryIndex !== -1 && pathParts.length > galleryIndex + 2) {
                    const folderName = pathParts[galleryIndex + 1];

                    if (!folderMap.has(folderName)) {
                        folderMap.set(folderName, []);
                    }
                    folderMap.get(folderName)?.push({
                        id: file.fileId,
                        url: file.url,
                        name: file.name,
                        createdAt: file.createdAt,
                    });
                }
            }
        });

        // Fetch metadata
        const metadata = await getAllFolderMetadata();
        const metadataMap = new Map(metadata.map(m => [m.folder_name, m.description]));

        // Convert to folders array and sort by most recent
        const folders = Array.from(folderMap.entries())
            .map(([name, images]) => {
                // Sort images by creation date
                const sortedImages = images.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                return {
                    id: name,
                    name: name,
                    coverImage: sortedImages[0]?.url || '',
                    count: images.length,
                    description: metadataMap.get(name) || null,
                    latestImageDate: sortedImages[0]?.createdAt || new Date().toISOString(),
                };
            })
            .sort((a, b) =>
                new Date(b.latestImageDate).getTime() - new Date(a.latestImageDate).getTime()
            )
            .slice(0, limit);

        return NextResponse.json({ folders });
    } catch (error: any) {
        console.error("Error fetching recent folders:", error);
        return NextResponse.json(
            {
                message: error.message || "Failed to fetch folders",
                folders: [],
            },
            { status: 500 }
        );
    }
}
