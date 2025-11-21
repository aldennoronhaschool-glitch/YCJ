-- Seed data for development/testing
-- Run this after setting up the schema

-- Insert sample admin user (replace with actual Clerk user ID after signup)
-- INSERT INTO users (id, email, role) VALUES 
-- ('clerk_user_id_here', 'admin@example.com', 'admin');

-- Insert sample events
INSERT INTO events (title, description, date, time, location, published) VALUES
('Youth Fellowship', 'Join us for an evening of worship, prayer, and fellowship. All youth are welcome!', CURRENT_DATE + INTERVAL '7 days', '18:00:00', 'Church Main Hall', true),
('Bible Study Session', 'Deep dive into the Word of God. We will be studying the Book of John.', CURRENT_DATE + INTERVAL '14 days', '19:00:00', 'Youth Room', true),
('Community Service Day', 'Let us serve our community together. We will be visiting the local orphanage.', CURRENT_DATE + INTERVAL '21 days', '09:00:00', 'Meet at Church', true);

-- Insert sample competitions
INSERT INTO competitions (title, description, max_participants) VALUES
('Bible Quiz Competition', 'Test your knowledge of the Bible! Individual and team categories available.', 50),
('Talent Show', 'Showcase your God-given talents. Singing, dancing, drama, and more!', 30),
('Art & Photography Contest', 'Express your faith through art. Submit your best work!', 100);

-- Insert sample announcements
INSERT INTO announcements (title, content) VALUES
('Welcome to YCJ!', 'We are excited to have you join our youth community. Stay tuned for upcoming events and activities.'),
('Prayer Meeting', 'Join us every Wednesday at 7 PM for our weekly prayer meeting. All are welcome!'),
('Volunteer Opportunities', 'We are looking for volunteers to help with upcoming events. Please contact the youth leaders if interested.');

-- Note: Gallery images and registrations will be added through the admin panel

