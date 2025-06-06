-- First, drop ALL existing policies on all tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on users table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
    END LOOP;
    
    -- Drop all policies on venues table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'venues') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON venues';
    END LOOP;
    
    -- Drop all policies on booking_requests table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'booking_requests') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON booking_requests';
    END LOOP;
    
    -- Drop all policies on events table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'events') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON events';
    END LOOP;
    
    -- Drop all policies on tickets table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'tickets') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON tickets';
    END LOOP;
END $$;

-- Completely disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE venues DISABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;

-- Force disable RLS (in case it's still enabled)
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Grant full access to authenticated users (for Supabase)
GRANT ALL ON users TO authenticated;
GRANT ALL ON venues TO authenticated;
GRANT ALL ON booking_requests TO authenticated;
GRANT ALL ON events TO authenticated;
GRANT ALL ON tickets TO authenticated;

-- Grant full access to anon users (for prototype)
GRANT ALL ON users TO anon;
GRANT ALL ON venues TO anon;
GRANT ALL ON booking_requests TO anon;
GRANT ALL ON events TO anon;
GRANT ALL ON tickets TO anon;
