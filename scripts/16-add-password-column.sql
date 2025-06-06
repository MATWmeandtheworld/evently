-- Add password column to users table
-- This script is safe to run multiple times

DO $$ 
BEGIN
    -- Check if password column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'password'
    ) THEN
        ALTER TABLE users ADD COLUMN password TEXT;
    END IF;
END $$;

-- Clear existing users and add test users with passwords
TRUNCATE TABLE users CASCADE;

-- Insert test users with simple passwords
INSERT INTO users (id, email, full_name, role, password, created_at, updated_at) VALUES
('admin-001', 'admin@evently.com', 'System Administrator', 'admin', 'password123', NOW(), NOW()),
('organizer-001', 'john.organizer@evently.com', 'John Smith', 'organizer', 'password123', NOW(), NOW()),
('organizer-002', 'sarah.organizer@evently.com', 'Sarah Johnson', 'organizer', 'password123', NOW(), NOW()),
('attendee-001', 'alex.attendee@evently.com', 'Alex Thompson', 'attendee', 'password123', NOW(), NOW()),
('attendee-002', 'emma.attendee@evently.com', 'Emma Davis', 'attendee', 'password123', NOW(), NOW()),
('attendee-003', 'mike.attendee@evently.com', 'Mike Wilson', 'attendee', 'password123', NOW(), NOW());
