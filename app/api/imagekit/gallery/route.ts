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
        const folderPath = searchParams.get('folder') || '';

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
                        console.log("Total ImageKit files found:", result?.length || 0);
                        resolve(result || []);
                    }
                }
            );
        });

        console.log("All files from ImageKit:", files.map(f => f.filePath));

        // Build the full path to search for
        const searchPath = folderPath ? `/gallery/${folderPath}/` : '/gallery/';
        console.log("Searching for path:", searchPath);

        // Group by immediate subfolders and collect images
        const folderMap = new Map<string, any[]>();
        const imagesList: any[] = [];
        const subfolderSet = new Set<string>();

        files.forEach((file) => {
            const filePath = file.filePath || "";

            // Only process files in the current search path
            if (filePath.startsWith(searchPath)) {
                // Get the relative path after the search path
                const relativePath = filePath.substring(searchPath.length);
                const pathParts = relativePath.split('/').filter(Boolean);

                if (pathParts.length === 1) {
                    // This is an image directly in the current folder
                    imagesList.push({
                        id: file.fileId,
                        url: file.url,
                        name: file.name,
                        thumbnail: file.thumbnail || file.url,
                    });
                } else if (pathParts.length > 1) {
                    // This is in a subfolder
                    const subfolderName = pathParts[0];
                    subfolderSet.add(subfolderName);

                    if (!folderMap.has(subfolderName)) {
                        folderMap.set(subfolderName, []);
                    }
                    folderMap.get(subfolderName)?.push({
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

        // Convert subfolders to array with metadata
        const subfolders = Array.from(folderMap.entries()).map(([name, images]) => {
            const fullFolderPath = folderPath ? `${folderPath}/${name}` : name;
            return {
                id: fullFolderPath,
                name: name,
                fullPath: fullFolderPath,
                coverImage: images[0]?.url || '',
                count: images.length,
                isFolder: true,
                description: metadataMap.get(fullFolderPath) || null,
            };
        });

        console.log("Subfolders found:", subfolders.length);
        console.log("Images in current folder:", imagesList.length);

        return NextResponse.json({
            currentPath: folderPath,
            subfolders,
            images: imagesList,
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
