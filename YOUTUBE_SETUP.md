# YouTube Videos Setup Guide

This guide explains how to set up and manage YouTube videos (livestreams and song covers) on your YCJ website.

## Database Setup

1. **Run the SQL migration** in your Supabase dashboard:
   - Navigate to your Supabase project
   - Go to the SQL Editor
   - Open and run the file: `supabase/youtube-videos.sql`
   - This creates the `youtube_videos` table with proper RLS policies

## Adding YouTube Videos

### Via Admin Panel

1. **Access the YouTube Management Page**:
   - Log in to the admin panel at `/admin`
   - Click on "Manage YouTube Videos"
   - Or navigate directly to `/admin/youtube`

2. **Add a New Video**:
   - Click the "Add Video" button
   - Fill in the form:
     - **Title**: Give your video a descriptive title (e.g., "Sunday Service - Nov 24, 2024")
     - **Video Type**: Select either "Livestream", "Song Cover", or "Other"
     - **YouTube URL**: Paste the full YouTube URL or just the video ID
       - Full URL example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
       - Video ID example: `dQw4w9WgXcQ`
     - **Description** (optional): Add a brief description
     - **Published Date**: Select when the video was published
     - **Display Order**: Lower numbers appear first (0, 1, 2, etc.)
     - **Featured**: Check this to show the video on the homepage
   - Click "Add Video"

3. **Edit or Delete Videos**:
   - Use the "Edit" button to modify video details
   - Use the "Delete" button to remove a video
   - Use the "Watch" button to preview the video on YouTube

4. **Filter Videos**:
   - Use the dropdown to filter by type (All, Livestreams, Song Covers, Other)

## Homepage Display

Videos will automatically appear on the homepage in two sections:

### Livestreams Section
- Shows up to 3 recent livestreams
- Displays embedded YouTube players
- Includes "Watch on YouTube" button

### Song Covers Section
- Shows up to 6 recent song covers
- Displays embedded YouTube players
- Includes "Watch on YouTube" button

**Note**: Sections only appear if there are videos of that type.

## Tips for Best Results

1. **Video Quality**: Use high-quality thumbnails by uploading good cover images to YouTube
2. **Titles**: Keep titles concise and descriptive
3. **Display Order**: Use display order to feature specific videos first
4. **Featured Videos**: Mark important videos as "featured" to ensure they appear on the homepage
5. **Regular Updates**: Keep your videos fresh by regularly adding new content

## Troubleshooting

### Videos not showing on homepage?
- Check that videos are marked as "featured" or adjust the display order
- Ensure the video type is set correctly (livestream or song_cover)
- Verify the YouTube video ID is correct

### Thumbnail not loading?
- The system automatically fetches thumbnails from YouTube
- If a thumbnail doesn't load, check that the video is public on YouTube

### Can't add videos?
- Ensure you're logged in as an admin
- Check that the Supabase table was created correctly
- Verify your YouTube URL is valid

## API Endpoints

For developers, the following API endpoints are available:

- `GET /api/admin/youtube` - Get all videos (optional `?type=` filter)
- `POST /api/admin/youtube` - Create a new video
- `PUT /api/admin/youtube` - Update a video
- `DELETE /api/admin/youtube?id=` - Delete a video

## Security

- All YouTube management pages require admin authentication
- Public users can only view videos, not edit them
- Row Level Security (RLS) is enabled on the database table
