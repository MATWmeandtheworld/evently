-- Create RPC functions to handle authentication without RLS issues

-- Function to get user by email
CREATE OR REPLACE FUNCTION get_user_by_email(user_email TEXT)
RETURNS TABLE(
    id UUID,
    email VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(20),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.full_name, u.role, u.phone, u.created_at, u.updated_at
    FROM users u
    WHERE u.email = user_email;
END;
$$;

-- Function to create new user
CREATE OR REPLACE FUNCTION create_new_user(
    user_email TEXT,
    user_name TEXT,
    user_role TEXT
)
RETURNS TABLE(
    id UUID,
    email VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(20),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Check if user already exists
    IF EXISTS (SELECT 1 FROM users WHERE users.email = user_email) THEN
        RAISE EXCEPTION 'User with email % already exists', user_email;
    END IF;

    -- Insert new user
    INSERT INTO users (email, full_name, role)
    VALUES (user_email, user_name, user_role)
    RETURNING users.id INTO new_user_id;

    -- Return the created user
    RETURN QUERY
    SELECT u.id, u.email, u.full_name, u.role, u.phone, u.created_at, u.updated_at
    FROM users u
    WHERE u.id = new_user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_by_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_new_user(TEXT, TEXT, TEXT) TO anon, authenticated;
