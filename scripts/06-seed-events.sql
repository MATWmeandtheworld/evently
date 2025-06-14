-- Insert events (based on approved booking requests)
INSERT INTO events (id, booking_request_id, organizer_id, venue_id, name, description, event_date, start_time, end_time, ticket_price, max_attendees, current_attendees) VALUES
('880e8400-e29b-41d4-a716-446655440001',
 '770e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440003',
 '660e8400-e29b-41d4-a716-446655440001',
 'Annual Tech Summit 2024',
 'Join us for the most comprehensive technology conference of the year! Network with industry leaders, discover cutting-edge innovations, and gain insights from expert speakers. This full-day event includes keynote presentations, panel discussions, networking sessions, and an exhibition showcase.',
 '2024-07-15',
 '09:00:00',
 '18:00:00',
 150.00,
 400,
 0),

('880e8400-e29b-41d4-a716-446655440002',
 '770e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440004',
 '660e8400-e29b-41d4-a716-446655440003',
 'Summer Wedding Celebration',
 'Celebrate love in our beautiful garden pavilion! This elegant wedding celebration includes ceremony and reception in a stunning outdoor setting surrounded by lush gardens and romantic lighting.',
 '2024-08-20',
 '15:00:00',
 '23:00:00',
 200.00,
 150,
 0),

-- Additional sample events for variety
('880e8400-e29b-41d4-a716-446655440003',
 NULL,
 '550e8400-e29b-41d4-a716-446655440005',
 '660e8400-e29b-41d4-a716-446655440005',
 'Creative Workshop Series',
 'Monthly creative workshop focusing on digital art, design thinking, and innovation. Perfect for artists, designers, and creative professionals.',
 '2024-07-08',
 '14:00:00',
 '17:00:00',
 75.00,
 45,
 0),

('880e8400-e29b-41d4-a716-446655440004',
 NULL,
 '550e8400-e29b-41d4-a716-446655440006',
 '660e8400-e29b-41d4-a716-446655440006',
 'Networking Night: Skyline Views',
 'Professional networking event with stunning city views. Connect with like-minded professionals while enjoying cocktails and appetizers on our beautiful rooftop terrace.',
 '2024-07-12',
 '18:30:00',
 '22:00:00',
 50.00,
 120,
 0);
