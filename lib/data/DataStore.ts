// lib/supabase/DataStore.ts

// Adjust the import path below if your supabase client is in a different location
import { supabase } from "../supabase/client";
import type {
  Venue,
  Event,
  BookingRequest,
  Ticket,
  User,
} from "@/lib/types/database";

// Note: You must already have the tables and RLS policies in Supabase.
//       This code assumes you created the tables exactly as described earlier.

export class DataStore {
  // ─────────────────────────────────────────────────
  // 1) VENUE OPERATIONS
  // ─────────────────────────────────────────────────

  static async getVenues(): Promise<Venue[]> {
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  static async getActiveVenues(): Promise<Venue[]> {
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  static async addVenue(venue: Omit<Venue, "id" | "created_at" | "updated_at">): Promise<Venue> {
    const { data, error } = await supabase
      .from("venues")
      .insert([venue])
      .select()
      .single();
    if (error || !data) throw error ?? new Error("Failed to add venue");
    return data;
  }

  static async updateVenue(id: string, updates: Partial<Venue>): Promise<Venue> {
    const { data, error } = await supabase
      .from("venues")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async deleteVenue(id: string): Promise<boolean> {
    const { error } = await supabase.from("venues").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  static async getVenueById(id: string): Promise<Venue | null> {
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error; // “no rows” isn’t fatal
    return data;
  }

  // ─────────────────────────────────────────────────
  // 2) EVENT OPERATIONS
  // ─────────────────────────────────────────────────

  static async getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  static async getEventsByOrganizer(organizerProfileId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_profile_id", organizerProfileId)
      .order("event_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  static async addEvent(event: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event> {
  const { data, error } = await supabase
    .from("events")
    .insert([event])
    .select()
    .single();
  if (error || !data) {
    console.error("Supabase addEvent error:", error, event);
    throw error ?? new Error("Failed to add event");
  }
  return data;
}

  static async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .single();
    if (error || !data) throw error ?? new Error("Failed to update event");
    return data;
  }

  static async deleteEvent(id: string): Promise<boolean> {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  static async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  static async getEventWithVenue(eventId: string): Promise<
    (Event & { venue_name: string; venue_location: string; organizer_name: string }) | null
  > {
    // Fetch the event row
    const { data: event, error: eErr } = await supabase
      .from("events")
      .select(`
        *,
        organizer_profiles!inner (
          user_id
        ),
        venues!inner (
          name,
          location
        )
      `)
      .eq("events.id", eventId)
      .single();

    if (eErr && eErr.code !== "PGRST116") throw eErr;
    if (!event) return null;

    // event.organizer_profiles.user_id is the user_id of the organizer
    const { data: user, error: uErr } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", event.organizer_profiles.user_id)
      .single();
    if (uErr && uErr.code !== "PGRST116") throw uErr;

    return {
      ...event,
      venue_name: event.venues.name,
      venue_location: event.venues.location,
      organizer_name: user?.full_name ?? "Unknown Organizer",
    };
  }

  // ─────────────────────────────────────────────────
  // 3) BOOKING REQUEST OPERATIONS
  // ─────────────────────────────────────────────────

  static async getBookingRequests(): Promise<BookingRequest[]> {
    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  static async addBookingRequest(
    request: Omit<BookingRequest, "id" | "created_at" | "updated_at" | "status">
  ): Promise<BookingRequest> {
    const { data, error } = await supabase
      .from("booking_requests")
      .insert([{ ...request, status: "pending" }])
      .single();
    if (error || !data) throw error ?? new Error("Failed to add booking request");
    return data;
  }

  static async updateBookingRequestStatus(
    id: string,
    status: "approved" | "rejected",
    admin_notes?: string
  ): Promise<BookingRequest> {
    const { data, error } = await supabase
      .from("booking_requests")
      .update({ status, admin_notes })
      .eq("id", id)
      .single();
    if (error || !data) throw error ?? new Error("Failed to update booking request");
    return data;
  }

  static async getBookingRequestWithDetails(
    requestId: string
  ): Promise<
    (BookingRequest & {
      venue_name: string;
      venue_location: string;
      venue_capacity: number;
      venue_price: number;
      organizer_name: string;
      organizer_email: string;
      organizer_phone: string;
    }) | null
  > {
    // 1) Fetch the booking request row
    const { data: request, error: rErr } = await supabase
      .from("booking_requests")
      .select(`
        *,
        organizer_profiles!inner (
          user_id,
          users!inner (
            full_name,
            email,
            phone
          )
        ),
        venues!inner (
          name,
          location,
          capacity,
          price_per_day
        )
      `)
      .eq("booking_requests.id", requestId)
      .single();

    if (rErr && rErr.code !== "PGRST116") throw rErr;
    if (!request) return null;

    return {
      ...request,
      venue_name: request.venues.name,
      venue_location: request.venues.location,
      venue_capacity: request.venues.capacity,
      venue_price: request.venues.price_per_day,
      organizer_name: request.organizer_profiles.users.full_name,
      organizer_email: request.organizer_profiles.users.email,
      organizer_phone: request.organizer_profiles.users.phone,
    };
  }

  // ─────────────────────────────────────────────────
  // 4) TICKET OPERATIONS
  // ─────────────────────────────────────────────────

  static async getTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("purchase_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  static async getTicketsByAttendee(attendeeId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("attendee_id", attendeeId)
      .order("purchase_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  static async addTicket(
    ticket: Omit<Ticket, "id" | "created_at" | "ticket_code">
  ): Promise<Ticket> {
    // 1) Insert the ticket record
    const { data: newTicket, error: tErr } = await supabase
      .from("tickets")
      .insert([ticket])
      .single();
    if (tErr || !newTicket) throw tErr ?? new Error("Failed to add ticket");

    // 2) Increment current_attendees on the event
    // Fetch event
    const { data: event, error: eErr } = await supabase
      .from("events")
      .select("current_attendees")
      .eq("id", ticket.event_id)
      .single();
    if (!eErr && event) {
      await supabase
        .from("events")
        .update({ current_attendees: (event.current_attendees ?? 0) + 1 })
        .eq("id", ticket.event_id);
    }

    return newTicket;
  }

  static async getEventByIdForTicket(eventId: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  // ─────────────────────────────────────────────────
  // 5) User
  // ─────────────────────────────────────────────────

  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
}
