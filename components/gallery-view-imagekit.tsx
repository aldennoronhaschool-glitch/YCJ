"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Folder, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageKitFile {
    id: string;
    url: string;
    name: string;
    thumbnail?: string;
}

interface ImageKitFolder {
    id: string;
    name: string;
    coverImage: string;
    count: number;
    images: ImageKitFile[];
}

export function GalleryViewImageKit() {
    const [folders, setFolders] = useState<ImageKitFolder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<ImageKitFolder | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"folders" | "images">("folders");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/imagekit/gallery');
            if (response.ok) {
                const data = await response.json();
                setFolders(data.folders || []);
            }
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFolderClick = (folder: ImageKitFolder) => {
        setSelectedFolder(folder);
        setView("images");
    };

    const handleBackToFolders = () => {
        setSelectedFolder(null);
        setView("folders");
    };

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        if (selectedFolder) {
            setCurrentImageIndex((prev) =>
                prev === selectedFolder.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const previousImage = () => {
        if (selectedFolder) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedFolder.images.length - 1 : prev - 1
            );
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') previousImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, currentImageIndex]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-gray-600">Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
                        <p className="text-gray-600">
                            {view === "folders"
                                ? "Browse our photo collections"
                                : selectedFolder?.name}
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
                                <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500">No gallery folders yet.</p>
                                <p className="text-sm text-gray-400 mt-2">Upload images in the admin panel to create folders.</p>
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
                                            {folder.coverImage ? (
                                                <Image
                                                    src={folder.coverImage}
                                                    alt={folder.name}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <Folder className="w-16 h-16 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Folder className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Album</span>
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
                        selectedFolder && (
                            selectedFolder.images.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No images in this folder.</p>
                                </div>
                            ) : (
                                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                                    {selectedFolder.images.map((image, index) => (
                                        <div
                                            key={image.id}
                                            onClick={() => openLightbox(index)}
                                            className="relative mb-4 break-inside-avoid rounded-lg overflow-hidden group cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="relative aspect-auto">
                                                <Image
                                                    src={image.url}
                                                    alt={image.name}
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && selectedFolder && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={previousImage}
                        className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <ChevronLeft className="w-12 h-12" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <ChevronRight className="w-12 h-12" />
                    </button>

                    <div className="max-w-7xl max-h-[90vh] relative">
                        <Image
                            src={selectedFolder.images[currentImageIndex].url}
                            alt={selectedFolder.images[currentImageIndex].name}
                            width={1920}
                            height={1080}
                            className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                            {currentImageIndex + 1} / {selectedFolder.images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
