-- Add additional profile columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(255),
ADD COLUMN IF NOT EXISTS dietary_preferences VARCHAR(255),
ADD COLUMN IF NOT EXISTS interests TEXT,
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS company_address TEXT,
ADD COLUMN IF NOT EXISTS business_license VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS social_media TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS specialization VARCHAR(255),
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS office_address TEXT,
ADD COLUMN IF NOT EXISTS access_level VARCHAR(50) DEFAULT 'Admin',
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
    user_id UUID,
    profile_data JSONB
)
RETURNS TABLE(
    id UUID,
    email VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(20),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    emergency_contact VARCHAR(255),
    dietary_preferences VARCHAR(255),
    interests TEXT,
    company_name VARCHAR(255),
    company_address TEXT,
    business_license VARCHAR(255),
    website VARCHAR(255),
    social_media TEXT,
    bio TEXT,
    specialization VARCHAR(255),
    years_experience INTEGER,
    employee_id VARCHAR(100),
    department VARCHAR(100),
    office_address TEXT,
    access_level VARCHAR(50),
    two_factor_enabled BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the user with the provided data
    UPDATE users SET
        full_name = COALESCE((profile_data->>'full_name')::VARCHAR(255), full_name),
        phone = COALESCE((profile_data->>'phone')::VARCHAR(20), phone),
        address = COALESCE((profile_data->>'address')::TEXT, address),
        date_of_birth = COALESCE((profile_data->>'date_of_birth')::DATE, date_of_birth),
        emergency_contact = COALESCE((profile_data->>'emergency_contact')::VARCHAR(255), emergency_contact),
        dietary_preferences = COALESCE((profile_data->>'dietary_preferences')::VARCHAR(255), dietary_preferences),
        interests = COALESCE((profile_data->>'interests')::TEXT, interests),
        company_name = COALESCE((profile_data->>'company_name')::VARCHAR(255), company_name),
        company_address = COALESCE((profile_data->>'company_address')::TEXT, company_address),
        business_license = COALESCE((profile_data->>'business_license')::VARCHAR(255), business_license),
        website = COALESCE((profile_data->>'website')::VARCHAR(255), website),
        social_media = COALESCE((profile_data->>'social_media')::TEXT, social_media),
        bio = COALESCE((profile_data->>'bio')::TEXT, bio),
        specialization = COALESCE((profile_data->>'specialization')::VARCHAR(255), specialization),
        years_experience = COALESCE((profile_data->>'years_experience')::INTEGER, years_experience),
        employee_id = COALESCE((profile_data->>'employee_id')::VARCHAR(100), employee_id),
        department = COALESCE((profile_data->>'department')::VARCHAR(100), department),
        office_address = COALESCE((profile_data->>'office_address')::TEXT, office_address),
        access_level = COALESCE((profile_data->>'access_level')::VARCHAR(50), access_level),
        two_factor_enabled = COALESCE((profile_data->>'two_factor_enabled')::BOOLEAN, two_factor_enabled),
        updated_at = NOW()
    WHERE users.id = user_id;

    -- Return the updated user data
    RETURN QUERY
    SELECT u.id, u.email, u.full_name, u.role, u.phone, u.address, u.date_of_birth,
           u.emergency_contact, u.dietary_preferences, u.interests, u.company_name,
           u.company_address, u.business_license, u.website, u.social_media, u.bio,
           u.specialization, u.years_experience, u.employee_id, u.department,
           u.office_address, u.access_level, u.two_factor_enabled, u.created_at, u.updated_at
    FROM users u
    WHERE u.id = user_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION update_user_profile TO authenticated, anon;
