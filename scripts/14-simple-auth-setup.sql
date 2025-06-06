-- Create a simple authentication system that bypasses Supabase Auth
-- Add password field to users table and create simple test users

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

-- Create a simple login function
CREATE OR REPLACE FUNCTION simple_login(user_email TEXT, user_password TEXT)
RETURNS TABLE(
  user_id TEXT,
  email TEXT,
  full_name TEXT,
  role TEXT,
  success BOOLEAN,
  message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id::TEXT,
    u.email::TEXT,
    u.full_name::TEXT,
    u.role::TEXT,
    CASE 
      WHEN u.password = user_password THEN TRUE 
      ELSE FALSE 
    END as success,
    CASE 
      WHEN u.password = user_password THEN 'Login successful'::TEXT
      ELSE 'Invalid credentials'::TEXT
    END as message
  FROM users u
  WHERE u.email = user_email;
  
  -- If no user found, return error
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      NULL::TEXT,
      NULL::TEXT,
      NULL::TEXT,
      NULL::TEXT,
      FALSE,
      'User not found'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql;
