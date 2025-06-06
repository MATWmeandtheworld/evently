import type { Venue, Event, BookingRequest, Ticket, User } from "@/lib/types/database"

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "admin@evently.com",
    full_name: "System Administrator",
    role: "admin",
    phone: "+1-555-0101",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "john.organizer@evently.com",
    full_name: "John Smith",
    role: "organizer",
    phone: "+1-555-0201",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    email: "alex.attendee@evently.com",
    full_name: "Alex Thompson",
    role: "attendee",
    phone: "+1-555-0301",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Dummy Venues
export const dummyVenues: Venue[] = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    name: "Grand Ballroom",
    description:
      "Elegant ballroom perfect for weddings, galas, and corporate events. Features crystal chandeliers, hardwood floors, and a built-in sound system.",
    location: "123 Luxury Ave, Downtown City, NY 10001",
    capacity: 500,
    price_per_day: 2500.0,
    amenities: ["Sound System", "Lighting", "Dance Floor", "Catering Kitchen", "Parking", "Air Conditioning"],
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    name: "Tech Conference Center",
    description:
      "Modern conference facility with state-of-the-art AV equipment, perfect for tech conferences, seminars, and business meetings.",
    location: "456 Innovation Blvd, Tech District, CA 94105",
    capacity: 300,
    price_per_day: 1800.0,
    amenities: ["Projectors", "WiFi", "Microphones", "Whiteboards", "Coffee Station", "Parking"],
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440003",
    name: "Outdoor Garden Pavilion",
    description: "Beautiful outdoor venue surrounded by gardens, ideal for weddings, parties, and outdoor events.",
    location: "789 Garden Way, Suburban Heights, FL 33101",
    capacity: 200,
    price_per_day: 1200.0,
    amenities: ["Garden Setting", "Covered Pavilion", "Outdoor Lighting", "Restrooms", "Parking"],
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440004",
    name: "Downtown Event Hall",
    description:
      "Versatile event space in the heart of downtown, suitable for concerts, exhibitions, and large gatherings.",
    location: "321 Main Street, City Center, TX 75201",
    capacity: 800,
    price_per_day: 3500.0,
    amenities: ["Stage", "Sound System", "Lighting Rig", "Security", "Bar Area", "Coat Check"],
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440005",
    name: "Intimate Studio Space",
    description: "Cozy studio perfect for workshops, small meetings, and creative sessions.",
    location: "654 Creative Lane, Arts Quarter, OR 97201",
    capacity: 50,
    price_per_day: 400.0,
    amenities: ["Natural Light", "Flexible Seating", "WiFi", "Kitchenette", "Art Supplies"],
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440006",
    name: "Rooftop Terrace",
    description: "Stunning rooftop venue with city skyline views, perfect for cocktail parties and networking events.",
    location: "987 Skyline Dr, Uptown District, IL 60601",
    capacity: 150,
    price_per_day: 2000.0,
    amenities: ["City Views", "Bar Setup", "Lounge Furniture", "Heating Lamps", "Elevator Access"],
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Dummy Events
export const dummyEvents: Event[] = [
  {
    id: "880e8400-e29b-41d4-a716-446655440001",
    booking_request_id: "770e8400-e29b-41d4-a716-446655440001",
    organizer_id: "550e8400-e29b-41d4-a716-446655440003",
    venue_id: "660e8400-e29b-41d4-a716-446655440001",
    name: "Annual Tech Summit 2024",
    description:
      "Join us for the most comprehensive technology conference of the year! Network with industry leaders, discover cutting-edge innovations, and gain insights from expert speakers.",
    event_date: "2024-07-15",
    start_time: "09:00:00",
    end_time: "18:00:00",
    ticket_price: 150.0,
    max_attendees: 400,
    current_attendees: 3,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440002",
    organizer_id: "550e8400-e29b-41d4-a716-446655440003",
    venue_id: "660e8400-e29b-41d4-a716-446655440005",
    name: "Creative Workshop Series",
    description:
      "Monthly creative workshop focusing on digital art, design thinking, and innovation. Perfect for artists, designers, and creative professionals.",
    event_date: "2024-07-08",
    start_time: "14:00:00",
    end_time: "17:00:00",
    ticket_price: 75.0,
    max_attendees: 45,
    current_attendees: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440003",
    organizer_id: "550e8400-e29b-41d4-a716-446655440003",
    venue_id: "660e8400-e29b-41d4-a716-446655440006",
    name: "Networking Night: Skyline Views",
    description:
      "Professional networking event with stunning city views. Connect with like-minded professionals while enjoying cocktails and appetizers.",
    event_date: "2024-07-12",
    start_time: "18:30:00",
    end_time: "22:00:00",
    ticket_price: 50.0,
    max_attendees: 120,
    current_attendees: 3,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440004",
    organizer_id: "550e8400-e29b-41d4-a716-446655440003",
    venue_id: "660e8400-e29b-41d4-a716-446655440003",
    name: "Summer Wedding Celebration",
    description:
      "Celebrate love in our beautiful garden pavilion! This elegant wedding celebration includes ceremony and reception in a stunning outdoor setting.",
    event_date: "2024-08-20",
    start_time: "15:00:00",
    end_time: "23:00:00",
    ticket_price: 200.0,
    max_attendees: 150,
    current_attendees: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Dummy Booking Requests
export const dummyBookingRequests: BookingRequest[] = [
  {
    id: "770e8400-e29b-41d4-a716-446655440003",
    organizer_id: "550e8400-e29b-41d4-a716-446655440003",
    venue_id: "660e8400-e29b-41d4-a716-446655440004",
    event_name: "Music Festival 2024",
    event_description: "Three-day music festival featuring local and international artists.",
    event_date: "2024-09-10",
    start_time: "12:00:00",
    end_time: "23:00:00",
    expected_attendees: 700,
    status: "pending",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440004",
    organizer_id: "550e8400-e29b-41d4-a716-446655440003",
    venue_id: "660e8400-e29b-41d4-a716-446655440002",
    event_name: "Startup Pitch Competition",
    event_description: "Monthly startup pitch event for entrepreneurs and investors.",
    event_date: "2024-07-25",
    start_time: "18:00:00",
    end_time: "21:00:00",
    expected_attendees: 250,
    status: "pending",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Dummy Tickets
export const dummyTickets: Ticket[] = [
  {
    id: "990e8400-e29b-41d4-a716-446655440001",
    event_id: "880e8400-e29b-41d4-a716-446655440001",
    attendee_id: "550e8400-e29b-41d4-a716-446655440007",
    ticket_code: "TKT-TECH001",
    purchase_date: "2024-01-01T00:00:00Z",
    price_paid: 150.0,
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "990e8400-e29b-41d4-a716-446655440007",
    event_id: "880e8400-e29b-41d4-a716-446655440003",
    attendee_id: "550e8400-e29b-41d4-a716-446655440007",
    ticket_code: "TKT-NET001",
    purchase_date: "2024-01-01T00:00:00Z",
    price_paid: 50.0,
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Helper functions to simulate database operations
export class DummyDataStore {
  private static venues = [...dummyVenues]
  private static events = [...dummyEvents]
  private static bookingRequests = [...dummyBookingRequests]
  private static tickets = [...dummyTickets]

  // Venue operations
  static getVenues(): Venue[] {
    return [...this.venues]
  }

  static getActiveVenues(): Venue[] {
    return this.venues.filter((venue) => venue.is_active)
  }

  static addVenue(venue: Omit<Venue, "id" | "created_at" | "updated_at">): Venue {
    const newVenue: Venue = {
      ...venue,
      id: `venue-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.venues.push(newVenue)
    return newVenue
  }

  static updateVenue(id: string, updates: Partial<Venue>): Venue | null {
    const index = this.venues.findIndex((venue) => venue.id === id)
    if (index === -1) return null

    this.venues[index] = {
      ...this.venues[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return this.venues[index]
  }

  static deleteVenue(id: string): boolean {
    const index = this.venues.findIndex((venue) => venue.id === id)
    if (index === -1) return false

    this.venues.splice(index, 1)
    return true
  }

  // Event operations
  static getEvents(): Event[] {
    return [...this.events]
  }

  static getEventsByOrganizer(organizerId: string): Event[] {
    return this.events.filter((event) => event.organizer_id === organizerId)
  }

  static addEvent(event: Omit<Event, "id" | "created_at" | "updated_at">): Event {
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.events.push(newEvent)
    return newEvent
  }

  static updateEvent(id: string, updates: Partial<Event>): Event | null {
    const index = this.events.findIndex((event) => event.id === id)
    if (index === -1) return null

    this.events[index] = {
      ...this.events[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return this.events[index]
  }

  // Booking request operations
  static getBookingRequests(): BookingRequest[] {
    return [...this.bookingRequests]
  }

  static addBookingRequest(
    request: Omit<BookingRequest, "id" | "created_at" | "updated_at" | "status">,
  ): BookingRequest {
    const newRequest: BookingRequest = {
      ...request,
      id: `booking-${Date.now()}`,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.bookingRequests.push(newRequest)
    return newRequest
  }

  static updateBookingRequestStatus(
    id: string,
    status: "approved" | "rejected",
    adminNotes?: string,
  ): BookingRequest | null {
    const index = this.bookingRequests.findIndex((request) => request.id === id)
    if (index === -1) return null

    this.bookingRequests[index] = {
      ...this.bookingRequests[index],
      status,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString(),
    }
    return this.bookingRequests[index]
  }

  // Ticket operations
  static getTickets(): Ticket[] {
    return [...this.tickets]
  }

  static getTicketsByAttendee(attendeeId: string): Ticket[] {
    return this.tickets.filter((ticket) => ticket.attendee_id === attendeeId)
  }

  static addTicket(ticket: Omit<Ticket, "id" | "created_at" | "ticket_code">): Ticket {
    const newTicket: Ticket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      ticket_code: `TKT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      created_at: new Date().toISOString(),
    }
    this.tickets.push(newTicket)

    // Update event attendee count
    const eventIndex = this.events.findIndex((event) => event.id === ticket.event_id)
    if (eventIndex !== -1) {
      this.events[eventIndex].current_attendees += 1
    }

    return newTicket
  }

  // Helper methods
  static getVenueById(id: string): Venue | null {
    return this.venues.find((venue) => venue.id === id) || null
  }

  static getEventById(id: string): Event | null {
    return this.events.find((event) => event.id === id) || null
  }

  static getEventWithVenue(eventId: string) {
    const event = this.getEventById(eventId)
    if (!event) return null

    const venue = this.getVenueById(event.venue_id)
    const organizer = dummyUsers.find((user) => user.id === event.organizer_id)

    return {
      ...event,
      venue_name: venue?.name || "Unknown Venue",
      venue_location: venue?.location || "Unknown Location",
      organizer_name: organizer?.full_name || "Unknown Organizer",
    }
  }

  static getBookingRequestWithDetails(requestId: string) {
    const request = this.bookingRequests.find((req) => req.id === requestId)
    if (!request) return null

    const venue = this.getVenueById(request.venue_id)
    const organizer = dummyUsers.find((user) => user.id === request.organizer_id)

    return {
      ...request,
      venue_name: venue?.name || "Unknown Venue",
      venue_location: venue?.location || "Unknown Location",
      venue_capacity: venue?.capacity || 0,
      venue_price: venue?.price_per_day || 0,
      organizer_name: organizer?.full_name || "Unknown Organizer",
      organizer_email: organizer?.email || "Unknown Email",
      organizer_phone: organizer?.phone || "Unknown Phone",
    }
  }
}
