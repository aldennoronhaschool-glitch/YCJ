"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageLightboxProps {
    src: string;
    alt: string;
    className?: string;
    imageClassName?: string;
}

export function ImageLightbox({ src, alt, className, imageClassName }: ImageLightboxProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`relative cursor-pointer group ${className}`}
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className={imageClassName || "object-cover"}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 bg-black/50 px-3 py-1 rounded-full text-sm transition-opacity">
                        View Fullscreen
                    </span>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[110]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div
                        className="relative w-full max-w-6xl h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            priority
                            quality={100}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
