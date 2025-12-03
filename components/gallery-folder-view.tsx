"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, X, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageKitFile {
    id: string;
    url: string;
    name: string;
    thumbnail?: string;
}

interface GalleryFolderViewProps {
    folderName: string;
}

export function GalleryFolderView({ folderName }: GalleryFolderViewProps) {
    const [images, setImages] = useState<ImageKitFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchFolderImages();
    }, [folderName]);

    const fetchFolderImages = async () => {
        try {
            setLoading(true);
            console.log('[GalleryFolderView] Fetching images for folder:', folderName);

            // The API expects just the folder name, it will add /gallery/ prefix
            const response = await fetch(`/api/imagekit/gallery?folder=${encodeURIComponent(folderName)}`);

            console.log('[GalleryFolderView] Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('[GalleryFolderView] Response data:', data);
                setImages(data.images || []);
            } else {
                console.error('[GalleryFolderView] Failed to fetch:', response.statusText);
            }
        } catch (error) {
            console.error("[GalleryFolderView] Error fetching folder images:", error);
        } finally {
            setLoading(false);
        }
    };

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
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
                    {/* Header with Back Button */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Button asChild variant="outline" className="gap-2">
                                <Link href="/gallery">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Gallery
                                </Link>
                            </Button>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Link href="/" className="hover:text-primary transition-colors">
                                <Home className="w-4 h-4" />
                            </Link>
                            <span>/</span>
                            <Link href="/gallery" className="hover:text-primary transition-colors">
                                Gallery
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-semibold">{folderName}</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{folderName}</h1>
                        <p className="text-gray-600">{images.length} {images.length === 1 ? 'photo' : 'photos'}</p>
                    </div>

                    {/* Images Grid */}
                    {images.length > 0 ? (
                        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                            {images.map((image, index) => (
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
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No photos in this folder yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && images.length > 0 && (
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
                            src={images[currentImageIndex].url}
                            alt={images[currentImageIndex].name}
                            width={1920}
                            height={1080}
                            className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
