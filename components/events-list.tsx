"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, X } from "lucide-react";
import { Event } from "@/lib/supabase/events";
import Image from "next/image";

export function EventsList({ events }: { events: Event[] }) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No events scheduled at the moment. Check back soon!</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                        {event.banner_url && (
                            <div
                                className="relative h-48 w-full cursor-pointer group"
                                onClick={() => setLightboxImage(event.banner_url!)}
                            >
                                <Image
                                    src={event.banner_url}
                                    alt={event.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <p className="text-white text-sm bg-black/50 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click to enlarge
                                    </p>
                                </div>
                            </div>
                        )}
                        <CardHeader>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{event.time}</span>
                                </div>
                            </div>
                            <CardTitle className="text-xl text-gray-900">{event.title}</CardTitle>
                            <CardDescription className="line-clamp-3 text-gray-600">
                                {event.description}
                            </CardDescription>
                            {event.location && (
                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={`/events/${event.id}`}>View Details</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-black z-50 overflow-auto"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="fixed top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <img
                            src={lightboxImage}
                            alt="Event banner"
                            className="max-w-full h-auto"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
