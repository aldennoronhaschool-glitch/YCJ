"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryImage, GalleryFolder } from "@/lib/supabase/gallery";
import { Event } from "@/lib/supabase/events";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GalleryView({
    images,
    events,
    folders,
}: {
    images: GalleryImage[];
    events: Event[];
    folders: GalleryFolder[];
}) {
    const searchParams = useSearchParams();
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [view, setView] = useState<"folders" | "images">("folders");

    useEffect(() => {
        const eventId = searchParams.get("event");
        const folderName = searchParams.get("folder");

        if (eventId || folderName) {
            setSelectedFolder(eventId || folderName || null);
            setView("images");
        }
    }, [searchParams]);

    const filteredImages = selectedFolder
        ? images.filter((img) => {
            if (searchParams.get("event")) {
                return img.event_id === selectedFolder;
            } else {
                return img.custom_event_name === selectedFolder;
            }
        })
        : images;

    const handleFolderClick = (folder: GalleryFolder) => {
        setSelectedFolder(folder.id);
        setView("images");
    };

    const handleBackToFolders = () => {
        setSelectedFolder(null);
        setView("folders");
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
                    <p className="text-gray-600">
                        {view === "folders"
                            ? "Browse our photo collections"
                            : selectedFolder && folders.find(f => f.id === selectedFolder)?.name}
                    </p>
                </div>

                {view === "images" && (
                    <div className="mb-6">
                        <Button
                            onClick={handleBackToFolders}
                            variant="outline"
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Folders
                        </Button>
                    </div>
                )}

                {view === "folders" ? (
                    // Folder Grid View
                    folders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No gallery folders yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => handleFolderClick(folder)}
                                    className="group block text-left"
                                >
                                    <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-md border-2 border-transparent group-hover:border-primary transition-all">
                                        <Image
                                            src={folder.coverImage}
                                            alt={folder.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Folder className="w-5 h-5" />
                                                <span className="text-sm font-medium">
                                                    {folder.type === 'event' ? 'Event' : 'Album'}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-1 line-clamp-2">{folder.name}</h3>
                                            <p className="text-sm text-white/80">{folder.count} Photos</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )
                ) : (
                    // Image Grid View
                    filteredImages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No images in this folder.</p>
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                            {filteredImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative mb-4 break-inside-avoid rounded-lg overflow-hidden group cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative aspect-auto">
                                        <Image
                                            src={image.image_url}
                                            alt="Gallery image"
                                            width={400}
                                            height={400}
                                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
