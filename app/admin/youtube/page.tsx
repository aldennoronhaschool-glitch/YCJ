"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Trash2, Plus, Edit, Youtube, ExternalLink } from "lucide-react";
import { getYouTubeWatchUrl, getYouTubeThumbnail } from "@/lib/supabase/youtube";
import Image from "next/image";

interface YouTubeVideo {
    id: string;
    title: string;
    description: string | null;
    video_id: string;
    video_type: 'livestream' | 'song_cover' | 'other';
    thumbnail_url: string | null;
    published_date: string | null;
    display_order: number;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface VideoFormData {
    title: string;
    description: string;
    video_url: string;
    video_type: 'livestream' | 'song_cover' | 'other';
    published_date: string;
    display_order: number;
    is_featured: boolean;
}

export default function YouTubeManagementPage() {
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'livestream' | 'song_cover' | 'other'>('all');

    const [formData, setFormData] = useState<VideoFormData>({
        title: '',
        description: '',
        video_url: '',
        video_type: 'song_cover',
        published_date: new Date().toISOString().split('T')[0],
        display_order: 0,
        is_featured: false
    });

    useEffect(() => {
        fetchVideos();
    }, [filterType]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const params = filterType !== 'all' ? `?type=${filterType}` : '';
            const response = await fetch(`/api/admin/youtube${params}`);
            const data = await response.json();
            setVideos(data.videos || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = '/api/admin/youtube';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId
                ? { id: editingId, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save video');
            }

            await fetchVideos();
            resetForm();
            alert(editingId ? 'Video updated successfully!' : 'Video added successfully!');
        } catch (error) {
            console.error('Error saving video:', error);
            alert(error instanceof Error ? error.message : 'Failed to save video');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (video: YouTubeVideo) => {
        setEditingId(video.id);
        setFormData({
            title: video.title,
            description: video.description || '',
            video_url: getYouTubeWatchUrl(video.video_id),
            video_type: video.video_type,
            published_date: video.published_date ? new Date(video.published_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            display_order: video.display_order,
            is_featured: video.is_featured
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const response = await fetch(`/api/admin/youtube?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete video');

            await fetchVideos();
            alert('Video deleted successfully!');
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Failed to delete video');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            video_url: '',
            video_type: 'song_cover',
            published_date: new Date().toISOString().split('T')[0],
            display_order: 0,
            is_featured: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    const filteredVideos = videos;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">YouTube Videos Management</h1>
                <p className="text-gray-600">Manage livestreams and song covers for your homepage</p>
            </div>

            {/* Filter and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Label htmlFor="filter">Filter by Type</Label>
                    <Select
                        id="filter"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                    >
                        <option value="all">All Videos</option>
                        <option value="livestream">Livestreams</option>
                        <option value="song_cover">Song Covers</option>
                        <option value="other">Other</option>
                    </Select>
                </div>
                <div className="flex items-end">
                    <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        {showForm ? 'Cancel' : 'Add Video'}
                    </Button>
                </div>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Video' : 'Add New Video'}</CardTitle>
                        <CardDescription>
                            Paste a YouTube URL or video ID. The thumbnail will be automatically fetched.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Sunday Service - Nov 24, 2024"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="video_type">Video Type *</Label>
                                    <Select
                                        id="video_type"
                                        value={formData.video_type}
                                        onChange={(e) => setFormData({ ...formData, video_type: e.target.value as any })}
                                    >
                                        <option value="livestream">Livestream</option>
                                        <option value="song_cover">Song Cover</option>
                                        <option value="other">Other</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="video_url">YouTube URL or Video ID *</Label>
                                <Input
                                    id="video_url"
                                    value={formData.video_url}
                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                    placeholder="https://www.youtube.com/watch?v=... or dQw4w9WgXcQ"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Paste the full YouTube URL or just the video ID
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="published_date">Published Date</Label>
                                    <Input
                                        id="published_date"
                                        type="date"
                                        value={formData.published_date}
                                        onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="display_order">Display Order</Label>
                                    <Input
                                        id="display_order"
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-gray-500">Lower numbers appear first</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="is_featured" className="flex items-center gap-2">
                                        <input
                                            id="is_featured"
                                            type="checkbox"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        Featured Video
                                    </Label>
                                    <p className="text-xs text-gray-500">Show on homepage</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={saving}>
                                    {saving ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
                                </Button>
                                {editingId && (
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Videos List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                    {filterType === 'all' ? 'All Videos' :
                        filterType === 'livestream' ? 'Livestreams' :
                            filterType === 'song_cover' ? 'Song Covers' : 'Other Videos'}
                    {' '}({filteredVideos.length})
                </h2>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading videos...</p>
                    </div>
                ) : filteredVideos.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Youtube className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-2">No videos found</p>
                            <p className="text-sm text-gray-400">Click "Add Video" to get started</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredVideos.map((video) => (
                            <Card key={video.id} className="overflow-hidden">
                                <div className="relative aspect-video bg-gray-100">
                                    <Image
                                        src={video.thumbnail_url || getYouTubeThumbnail(video.video_id, 'hq')}
                                        alt={video.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {video.is_featured && (
                                        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                            Featured
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {video.video_type === 'livestream' ? 'Livestream' :
                                            video.video_type === 'song_cover' ? 'Song Cover' : 'Other'}
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                                    {video.description && (
                                        <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.open(getYouTubeWatchUrl(video.video_id), '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Watch
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(video)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(video.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Order: {video.display_order} | {new Date(video.published_date || video.created_at).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
