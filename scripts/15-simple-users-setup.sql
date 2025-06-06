-- Simple user setup without custom functions
-- Just ensure the users table has the password column and test data

-- Add password column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Clear existing users and create simple test users
DELETE FROM users;

-- Insert test users with simple passwords
INSERT INTO users (id, email, full_name, role, password, created_at, updated_at) VALUES
('admin-001', 'admin@evently.com', 'System Administrator', 'admin', 'password123', NOW(), NOW()),
('organizer-001', 'john.organizer@evently.com', 'John Smith', 'organizer', 'password123', NOW(), NOW()),
('organizer-002', 'sarah.organizer@evently.com', 'Sarah Johnson', 'organizer', 'password123', NOW(), NOW()),
('attendee-001', 'alex.attendee@evently.com', 'Alex Thompson', 'attendee', 'password123', NOW(), NOW()),
('attendee-002', 'emma.attendee@evently.com', 'Emma Davis', 'attendee', 'password123', NOW(), NOW()),
('attendee-003', 'mike.attendee@evently.com', 'Mike Wilson', 'attendee', 'password123', NOW(), NOW());
