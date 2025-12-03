import { GalleryFolderView } from "@/components/gallery-folder-view";
import { Navbar } from "@/components/navbar";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        folderName: string;
    };
}

export default async function GalleryFolderPage({ params }: PageProps) {
    const folderName = decodeURIComponent(params.folderName);

    return (
        <>
            <Navbar />
            <GalleryFolderView folderName={folderName} />
        </>
    );
}
