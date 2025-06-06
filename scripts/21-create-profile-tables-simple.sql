-- Create attendee profiles table
CREATE TABLE IF NOT EXISTS attendee_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    date_of_birth DATE,
    emergency_contact TEXT,
    dietary_preferences TEXT,
    interests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create organizer profiles table
CREATE TABLE IF NOT EXISTS organizer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT,
    company_address TEXT,
    business_license TEXT,
    website TEXT,
    social_media TEXT,
    bio TEXT,
    specialization TEXT,
    years_experience INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create admin profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id TEXT,
    department TEXT,
    office_address TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Disable RLS on profile tables
ALTER TABLE attendee_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON attendee_profiles TO authenticated, anon;
GRANT ALL ON organizer_profiles TO authenticated, anon;
GRANT ALL ON admin_profiles TO authenticated, anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendee_profiles_user_id ON attendee_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_profiles_user_id ON organizer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
