export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "organizer" | "attendee"
  phone?: string
  created_at: string
  updated_at: string
}

export interface Venue {
  id: string
  name: string
  description?: string
  location: string
  capacity: number
  price_per_day: number
  amenities: string[]
  image_url?: string
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface BookingRequest {
  id: string
  organizer_id: string
  venue_id: string
  event_name: string
  event_description?: string
  event_date: string
  start_time: string
  end_time: string
  expected_attendees: number
  status: "pending" | "approved" | "rejected"
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  booking_request_id?: string
  organizer_id: string
  venue_id: string
  name: string
  description?: string
  event_date: string
  start_time: string
  end_time: string
  ticket_price: number
  max_attendees: number
  current_attendees: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  event_id: string
  attendee_id: string
  ticket_code: string
  purchase_date: string
  price_paid: number
  status: "active" | "cancelled" | "used"
  created_at: string
}
