-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    connection TEXT NOT NULL CHECK (connection IN ('member', 'attending', 'online-other', 'online-only', 'none')),
    message_title TEXT NOT NULL,
    message_body TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (submit contact form)
CREATE POLICY "Anyone can submit contact form"
    ON contact_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users can view submissions
CREATE POLICY "Authenticated users can view submissions"
    ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only authenticated users can update submissions
CREATE POLICY "Authenticated users can update submissions"
    ON contact_submissions
    FOR UPDATE
    TO authenticated
    USING (true);

-- Policy: Only authenticated users can delete submissions
CREATE POLICY "Authenticated users can delete submissions"
    ON contact_submissions
    FOR DELETE
    TO authenticated
    USING (true);

-- Add comment
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the website';
