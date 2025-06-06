-- Create test users with proper authentication
-- Note: These will be created through the application, but this shows the expected data structure

-- Insert test users (these should match the ones in test-credentials.tsx)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'admin@evently.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator", "role": "admin"}'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'john.organizer@evently.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "John Smith", "role": "organizer"}'
),
(
  '550e8400-e29b-41d4-a716-446655440007',
  'alex.attendee@evently.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Alex Thompson", "role": "attendee"}'
)
ON CONFLICT (id) DO NOTHING;

-- The corresponding user profiles should already exist from the previous seed scripts
-- But let's make sure they're properly linked
UPDATE users SET 
  id = '550e8400-e29b-41d4-a716-446655440001'
WHERE email = 'admin@evently.com';

UPDATE users SET 
  id = '550e8400-e29b-41d4-a716-446655440003'
WHERE email = 'john.organizer@evently.com';

UPDATE users SET 
  id = '550e8400-e29b-41d4-a716-446655440007'
WHERE email = 'alex.attendee@evently.com';
