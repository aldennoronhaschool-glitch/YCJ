'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Play, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/navbar";

interface YouTubeVideo {
    id: string;
    title: string;
    description: string | null;
    video_id: string;
    video_type: 'livestream' | 'song_cover' | 'other';
    thumbnail_url: string;
    published_date: string;
    display_order: number;
    is_featured: boolean;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [filter, setFilter] = useState<'all' | 'livestream' | 'song_cover'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
    }, [filter]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const url = filter === 'all'
                ? '/api/admin/youtube'
                : `/api/admin/youtube?type=${filter}`;

            const response = await fetch(url);
            const data = await response.json();

            // Ensure data is always an array
            if (Array.isArray(data)) {
                setVideos(data);
            } else if (data && Array.isArray(data.videos)) {
                setVideos(data.videos);
            } else {
                console.error('Unexpected data format:', data);
                setVideos([]);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeWatchUrl = (videoId: string) => {
        return `https://www.youtube.com/watch?v=${videoId}`;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center gap-3 mb-4">
                            <Youtube className="w-10 h-10 text-red-600" />
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Our Videos</h1>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Watch our worship services, livestreams, and song covers
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex justify-center gap-4 mb-8">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            onClick={() => setFilter('all')}
                        >
                            All Videos
                        </Button>
                        <Button
                            variant={filter === 'livestream' ? 'default' : 'outline'}
                            onClick={() => setFilter('livestream')}
                        >
                            Livestreams
                        </Button>
                        <Button
                            variant={filter === 'song_cover' ? 'default' : 'outline'}
                            onClick={() => setFilter('song_cover')}
                        >
                            Song Covers
                        </Button>
                    </div>

                    {/* Videos Grid */}
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Loading videos...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="text-center py-12">
                            <Youtube className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">No videos found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                    <div className="relative aspect-video bg-gray-100">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${video.video_id}`}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0 w-full h-full"
                                        />
                                    </div>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${video.video_type === 'livestream'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                {video.video_type === 'livestream' ? 'Livestream' : 'Song Cover'}
                                            </span>
                                            {video.is_featured && (
                                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            {video.title}
                                        </CardTitle>
                                        {video.description && (
                                            <CardDescription className="line-clamp-2">
                                                {video.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <a
                                                href={getYouTubeWatchUrl(video.video_id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Play className="w-4 h-4 mr-2" />
                                                Watch on YouTube
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
