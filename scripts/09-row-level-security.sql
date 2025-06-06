-- Enable Row Level Security (RLS) for data protection
-- Note: This is a simplified version for the prototype

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create policies for venues table
-- Everyone can view active venues
CREATE POLICY "Everyone can view active venues" ON venues
    FOR SELECT USING (is_active = true);

-- Admins can manage all venues
CREATE POLICY "Admins can manage venues" ON venues
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create policies for booking_requests table
-- Organizers can view their own requests
CREATE POLICY "Organizers can view own requests" ON booking_requests
    FOR SELECT USING (organizer_id::text = auth.uid()::text);

-- Organizers can create requests
CREATE POLICY "Organizers can create requests" ON booking_requests
    FOR INSERT WITH CHECK (
        organizer_id::text = auth.uid()::text AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'organizer'
        )
    );

-- Admins can view and update all requests
CREATE POLICY "Admins can manage all requests" ON booking_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create policies for events table
-- Everyone can view active events
CREATE POLICY "Everyone can view active events" ON events
    FOR SELECT USING (is_active = true);

-- Organizers can manage their own events
CREATE POLICY "Organizers can manage own events" ON events
    FOR ALL USING (organizer_id::text = auth.uid()::text);

-- Create policies for tickets table
-- Attendees can view their own tickets
CREATE POLICY "Attendees can view own tickets" ON tickets
    FOR SELECT USING (attendee_id::text = auth.uid()::text);

-- Attendees can purchase tickets
CREATE POLICY "Attendees can purchase tickets" ON tickets
    FOR INSERT WITH CHECK (
        attendee_id::text = auth.uid()::text AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'attendee'
        )
    );

-- Organizers can view tickets for their events
CREATE POLICY "Organizers can view event tickets" ON tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = tickets.event_id 
            AND events.organizer_id::text = auth.uid()::text
        )
    );
