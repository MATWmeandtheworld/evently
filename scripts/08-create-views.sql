-- Create useful views for the application

-- View for event details with venue and organizer information
CREATE VIEW event_details AS
SELECT 
    e.id,
    e.name,
    e.description,
    e.event_date,
    e.start_time,
    e.end_time,
    e.ticket_price,
    e.max_attendees,
    e.current_attendees,
    e.is_active,
    v.name as venue_name,
    v.location as venue_location,
    v.capacity as venue_capacity,
    u.full_name as organizer_name,
    u.email as organizer_email,
    e.created_at
FROM events e
JOIN venues v ON e.venue_id = v.id
JOIN users u ON e.organizer_id = u.id;

-- View for booking request details
CREATE VIEW booking_request_details AS
SELECT 
    br.id,
    br.event_name,
    br.event_description,
    br.event_date,
    br.start_time,
    br.end_time,
    br.expected_attendees,
    br.status,
    br.admin_notes,
    u.full_name as organizer_name,
    u.email as organizer_email,
    u.phone as organizer_phone,
    v.name as venue_name,
    v.location as venue_location,
    v.capacity as venue_capacity,
    v.price_per_day as venue_price,
    br.created_at,
    br.updated_at
FROM booking_requests br
JOIN users u ON br.organizer_id = u.id
JOIN venues v ON br.venue_id = v.id;

-- View for ticket details with event and attendee information
CREATE VIEW ticket_details AS
SELECT 
    t.id,
    t.ticket_code,
    t.purchase_date,
    t.price_paid,
    t.status,
    e.name as event_name,
    e.event_date,
    e.start_time,
    e.end_time,
    v.name as venue_name,
    v.location as venue_location,
    u.full_name as attendee_name,
    u.email as attendee_email,
    org.full_name as organizer_name
FROM tickets t
JOIN events e ON t.event_id = e.id
JOIN venues v ON e.venue_id = v.id
JOIN users u ON t.attendee_id = u.id
JOIN users org ON e.organizer_id = org.id;
