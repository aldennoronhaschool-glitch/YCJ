import { GalleryFolderView } from "@/components/gallery-folder-view";
import { Navbar } from "@/components/navbar";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        folderName: string;
    }>;
}

export default async function GalleryFolderPage({ params }: PageProps) {
    const { folderName } = await params;
    const decodedFolderName = decodeURIComponent(folderName);

    return (
        <>
            <Navbar />
            <GalleryFolderView folderName={decodedFolderName} />
        </>
    );
}
