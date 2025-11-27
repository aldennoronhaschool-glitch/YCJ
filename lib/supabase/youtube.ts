import { createClient } from '@/lib/supabase/client';

export interface YouTubeVideo {
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

export interface YouTubeVideoInput {
    title: string;
    description?: string;
    video_id: string;
    video_type: 'livestream' | 'song_cover' | 'other';
    thumbnail_url?: string;
    published_date?: string;
    display_order?: number;
    is_featured?: boolean;
}

// Get YouTube thumbnail URL from video ID
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

// Get YouTube embed URL from video ID
export function getYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
}

// Get YouTube watch URL from video ID
export function getYouTubeWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
}

// Extract video ID from YouTube URL
export function extractYouTubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

// Get all YouTube videos
export async function getYouTubeVideos(type?: 'livestream' | 'song_cover' | 'other'): Promise<YouTubeVideo[]> {
    const supabase = createClient();

    let query = supabase
        .from('youtube_videos')
        .select('*')
        .order('display_order', { ascending: true })
        .order('published_date', { ascending: false });

    if (type) {
        query = query.eq('video_type', type);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }

    return data || [];
}

// Get featured YouTube videos
export async function getFeaturedYouTubeVideos(limit: number = 6): Promise<YouTubeVideo[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('published_date', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured YouTube videos:', error);
        return [];
    }

    return data || [];
}

// Get YouTube videos by type with limit
export async function getYouTubeVideosByType(
    type: 'livestream' | 'song_cover' | 'other',
    limit: number = 4
): Promise<YouTubeVideo[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('video_type', type)
        .order('display_order', { ascending: true })
        .order('published_date', { ascending: false })
        .limit(limit);

    if (error) {
        console.error(`Error fetching ${type} videos:`, error);
        return [];
    }

    return data || [];
}

// Get a single YouTube video by ID
export async function getYouTubeVideoById(id: string): Promise<YouTubeVideo | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching YouTube video:', error);
        return null;
    }

    return data;
}

// Create a new YouTube video
export async function createYouTubeVideo(video: YouTubeVideoInput): Promise<YouTubeVideo | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('youtube_videos')
        .insert([video])
        .select()
        .single();

    if (error) {
        console.error('Error creating YouTube video:', error);
        throw error;
    }

    return data;
}

// Update a YouTube video
export async function updateYouTubeVideo(id: string, updates: Partial<YouTubeVideoInput>): Promise<YouTubeVideo | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('youtube_videos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating YouTube video:', error);
        throw error;
    }

    return data;
}

// Delete a YouTube video
export async function deleteYouTubeVideo(id: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting YouTube video:', error);
        throw error;
    }

    return true;
}
