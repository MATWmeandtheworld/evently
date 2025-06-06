-- Create profile tables for each role

-- Attendee profiles table
CREATE TABLE IF NOT EXISTS attendee_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    date_of_birth DATE,
    emergency_contact VARCHAR(255),
    dietary_preferences VARCHAR(500),
    interests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Organizer profiles table
CREATE TABLE IF NOT EXISTS organizer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    company_address TEXT,
    business_license VARCHAR(255),
    website VARCHAR(500),
    social_media TEXT,
    bio TEXT,
    specialization VARCHAR(255),
    years_experience INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Admin profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(100),
    department VARCHAR(255),
    office_address TEXT,
    emergency_contact VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendee_profiles_user_id ON attendee_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_profiles_user_id ON organizer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);

-- Disable RLS on profile tables
ALTER TABLE attendee_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON attendee_profiles TO authenticated, anon;
GRANT ALL ON organizer_profiles TO authenticated, anon;
GRANT ALL ON admin_profiles TO authenticated, anon;

-- Add triggers for updated_at
CREATE TRIGGER update_attendee_profiles_updated_at 
    BEFORE UPDATE ON attendee_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizer_profiles_updated_at 
    BEFORE UPDATE ON organizer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at 
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
