-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Organizers can view own requests" ON booking_requests;
DROP POLICY IF EXISTS "Organizers can create requests" ON booking_requests;
DROP POLICY IF EXISTS "Admins can manage all requests" ON booking_requests;
DROP POLICY IF EXISTS "Everyone can view active events" ON events;
DROP POLICY IF EXISTS "Organizers can manage own events" ON events;
DROP POLICY IF EXISTS "Attendees can view own tickets" ON tickets;
DROP POLICY IF EXISTS "Attendees can purchase tickets" ON tickets;
DROP POLICY IF EXISTS "Organizers can view event tickets" ON tickets;

-- Temporarily disable RLS for prototype (simpler approach)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE venues DISABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;

-- For production, you would create more sophisticated policies
-- But for prototype, we'll keep it simple and secure through application logic
