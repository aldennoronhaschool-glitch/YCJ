import { NextRequest, NextResponse } from 'next/server';
import {
    getYouTubeVideos,
    createYouTubeVideo,
    updateYouTubeVideo,
    deleteYouTubeVideo,
    extractYouTubeVideoId,
    getYouTubeThumbnail,
    type YouTubeVideoInput
} from '@/lib/supabase/youtube';

// GET - Fetch all YouTube videos or filter by type
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type') as 'livestream' | 'song_cover' | 'other' | null;

        const videos = await getYouTubeVideos(type || undefined);

        return NextResponse.json({ videos });
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch YouTube videos' },
            { status: 500 }
        );
    }
}

// POST - Create a new YouTube video
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, video_url, video_type, published_date, display_order, is_featured } = body;

        // Validate required fields
        if (!title || !video_url || !video_type) {
            return NextResponse.json(
                { error: 'Title, video URL, and video type are required' },
                { status: 400 }
            );
        }

        // Extract video ID from URL
        const video_id = extractYouTubeVideoId(video_url);
        if (!video_id) {
            return NextResponse.json(
                { error: 'Invalid YouTube URL. Please provide a valid YouTube video URL or ID.' },
                { status: 400 }
            );
        }

        // Get YouTube thumbnail
        const thumbnail_url = getYouTubeThumbnail(video_id, 'maxres');

        const videoData: YouTubeVideoInput = {
            title,
            description: description || '',
            video_id,
            video_type,
            thumbnail_url,
            published_date: published_date || new Date().toISOString(),
            display_order: display_order || 0,
            is_featured: is_featured || false
        };

        const video = await createYouTubeVideo(videoData);

        return NextResponse.json({ video }, { status: 201 });
    } catch (error) {
        console.error('Error creating YouTube video:', error);
        return NextResponse.json(
            { error: 'Failed to create YouTube video' },
            { status: 500 }
        );
    }
}

// PUT - Update a YouTube video
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, description, video_url, video_type, published_date, display_order, is_featured } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            );
        }

        const updates: Partial<YouTubeVideoInput> = {};

        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (video_type !== undefined) updates.video_type = video_type;
        if (published_date !== undefined) updates.published_date = published_date;
        if (display_order !== undefined) updates.display_order = display_order;
        if (is_featured !== undefined) updates.is_featured = is_featured;

        // If video URL is updated, extract new video ID and thumbnail
        if (video_url) {
            const video_id = extractYouTubeVideoId(video_url);
            if (!video_id) {
                return NextResponse.json(
                    { error: 'Invalid YouTube URL' },
                    { status: 400 }
                );
            }
            updates.video_id = video_id;
            updates.thumbnail_url = getYouTubeThumbnail(video_id, 'maxres');
        }

        const video = await updateYouTubeVideo(id, updates);

        return NextResponse.json({ video });
    } catch (error) {
        console.error('Error updating YouTube video:', error);
        return NextResponse.json(
            { error: 'Failed to update YouTube video' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a YouTube video
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            );
        }

        await deleteYouTubeVideo(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting YouTube video:', error);
        return NextResponse.json(
            { error: 'Failed to delete YouTube video' },
            { status: 500 }
        );
    }
}
