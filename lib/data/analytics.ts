import { DummyDataStore, dummyUsers } from "./dummy-data"

export interface AdminAnalytics {
  overview: {
    totalUsers: number
    totalVenues: number
    totalEvents: number
    totalRevenue: number
    monthlyGrowth: number
  }
  venuePerformance: {
    venue: string
    bookings: number
    revenue: number
    utilizationRate: number
  }[]
  eventTrends: {
    month: string
    events: number
    revenue: number
    attendees: number
  }[]
  bookingStats: {
    pending: number
    approved: number
    rejected: number
    approvalRate: number
    avgResponseTime: number
  }
  revenueByCategory: {
    category: string
    revenue: number
    percentage: number
  }[]
  userGrowth: {
    month: string
    admins: number
    organizers: number
    attendees: number
  }[]
}

export interface OrganizerAnalytics {
  overview: {
    totalEvents: number
    totalRevenue: number
    totalAttendees: number
    avgTicketPrice: number
    conversionRate: number
  }
  eventPerformance: {
    eventName: string
    ticketsSold: number
    revenue: number
    attendanceRate: number
    date: string
  }[]
  revenueOverTime: {
    month: string
    revenue: number
    events: number
  }[]
  venueUsage: {
    venue: string
    timesUsed: number
    totalRevenue: number
    avgAttendees: number
  }[]
  ticketSales: {
    week: string
    sold: number
    revenue: number
  }[]
  attendeeInsights: {
    totalUniqueAttendees: number
    repeatAttendees: number
    avgTicketsPerAttendee: number
    topEvents: string[]
  }
}

export class AnalyticsService {
  // Admin Analytics
  static getAdminAnalytics(): AdminAnalytics {
    const venues = DummyDataStore.getVenues()
    const events = DummyDataStore.getEvents()
    const bookingRequests = DummyDataStore.getBookingRequests()
    const tickets = DummyDataStore.getTickets()

    // Overview metrics
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price_paid, 0)
    const monthlyGrowth = 12.5 // Mock growth percentage

    // Venue performance
    const venuePerformance = venues
      .map((venue) => {
        const venueEvents = events.filter((event) => event.venue_id === venue.id)
        const venueTickets = tickets.filter((ticket) => venueEvents.some((event) => event.id === ticket.event_id))
        const revenue = venueTickets.reduce((sum, ticket) => sum + ticket.price_paid, 0)
        const bookings = venueEvents.length
        const utilizationRate = Math.min((bookings / 12) * 100, 100) // Assuming 12 possible bookings per year

        return {
          venue: venue.name,
          bookings,
          revenue,
          utilizationRate: Math.round(utilizationRate),
        }
      })
      .sort((a, b) => b.revenue - a.revenue)

    // Event trends (mock monthly data)
    const eventTrends = [
      { month: "Jan", events: 8, revenue: 12500, attendees: 450 },
      { month: "Feb", events: 12, revenue: 18200, attendees: 680 },
      { month: "Mar", events: 15, revenue: 22800, attendees: 820 },
      { month: "Apr", events: 18, revenue: 28500, attendees: 950 },
      { month: "May", events: 22, revenue: 35200, attendees: 1200 },
      { month: "Jun", events: 25, revenue: 42000, attendees: 1450 },
    ]

    // Booking statistics
    const pendingRequests = bookingRequests.filter((req) => req.status === "pending").length
    const approvedRequests = bookingRequests.filter((req) => req.status === "approved").length
    const rejectedRequests = bookingRequests.filter((req) => req.status === "rejected").length
    const totalRequests = bookingRequests.length
    const approvalRate = totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0

    // Revenue by category (mock data based on event types)
    const revenueByCategory = [
      { category: "Technology", revenue: 45000, percentage: 35 },
      { category: "Networking", revenue: 28000, percentage: 22 },
      { category: "Workshops", revenue: 25000, percentage: 19 },
      { category: "Weddings", revenue: 20000, percentage: 16 },
      { category: "Other", revenue: 10000, percentage: 8 },
    ]

    // User growth (mock data)
    const userGrowth = [
      { month: "Jan", admins: 2, organizers: 8, attendees: 45 },
      { month: "Feb", admins: 2, organizers: 12, attendees: 78 },
      { month: "Mar", admins: 3, organizers: 18, attendees: 125 },
      { month: "Apr", admins: 3, organizers: 25, attendees: 189 },
      { month: "May", admins: 4, organizers: 32, attendees: 267 },
      { month: "Jun", admins: 4, organizers: 38, attendees: 342 },
    ]

    return {
      overview: {
        totalUsers: dummyUsers.length,
        totalVenues: venues.length,
        totalEvents: events.length,
        totalRevenue,
        monthlyGrowth,
      },
      venuePerformance,
      eventTrends,
      bookingStats: {
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        approvalRate: Math.round(approvalRate),
        avgResponseTime: 1.5, // Mock average response time in days
      },
      revenueByCategory,
      userGrowth,
    }
  }

  // Organizer Analytics
  static getOrganizerAnalytics(organizerId: string): OrganizerAnalytics {
    const organizerEvents = DummyDataStore.getEventsByOrganizer(organizerId)
    const organizerTickets = DummyDataStore.getTickets().filter((ticket) =>
      organizerEvents.some((event) => event.id === ticket.event_id),
    )

    // Overview metrics
    const totalRevenue = organizerTickets.reduce((sum, ticket) => sum + ticket.price_paid, 0)
    const totalAttendees = organizerTickets.length
    const avgTicketPrice = totalAttendees > 0 ? totalRevenue / totalAttendees : 0
    const conversionRate = 78.5 // Mock conversion rate

    // Event performance
    const eventPerformance = organizerEvents
      .map((event) => {
        const eventTickets = organizerTickets.filter((ticket) => ticket.event_id === event.id)
        const revenue = eventTickets.reduce((sum, ticket) => sum + ticket.price_paid, 0)
        const attendanceRate = (event.current_attendees / event.max_attendees) * 100

        return {
          eventName: event.name,
          ticketsSold: eventTickets.length,
          revenue,
          attendanceRate: Math.round(attendanceRate),
          date: event.event_date,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)

    // Revenue over time (mock monthly data)
    const revenueOverTime = [
      { month: "Jan", revenue: 2500, events: 1 },
      { month: "Feb", revenue: 4200, events: 2 },
      { month: "Mar", revenue: 6800, events: 2 },
      { month: "Apr", revenue: 8500, events: 3 },
      { month: "May", revenue: 12200, events: 4 },
      { month: "Jun", revenue: 15000, events: 4 },
    ]

    // Venue usage
    const venueUsage = DummyDataStore.getVenues()
      .map((venue) => {
        const venueEvents = organizerEvents.filter((event) => event.venue_id === venue.id)
        const venueTickets = organizerTickets.filter((ticket) =>
          venueEvents.some((event) => event.id === ticket.event_id),
        )
        const totalRevenue = venueTickets.reduce((sum, ticket) => sum + ticket.price_paid, 0)
        const avgAttendees =
          venueEvents.length > 0
            ? venueEvents.reduce((sum, event) => sum + event.current_attendees, 0) / venueEvents.length
            : 0

        return {
          venue: venue.name,
          timesUsed: venueEvents.length,
          totalRevenue,
          avgAttendees: Math.round(avgAttendees),
        }
      })
      .filter((usage) => usage.timesUsed > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)

    // Ticket sales over time (mock weekly data)
    const ticketSales = [
      { week: "Week 1", sold: 25, revenue: 3750 },
      { week: "Week 2", sold: 32, revenue: 4800 },
      { week: "Week 3", sold: 28, revenue: 4200 },
      { week: "Week 4", sold: 45, revenue: 6750 },
      { week: "Week 5", sold: 38, revenue: 5700 },
      { week: "Week 6", sold: 52, revenue: 7800 },
    ]

    // Attendee insights
    const uniqueAttendees = new Set(organizerTickets.map((ticket) => ticket.attendee_id)).size
    const repeatAttendees = organizerTickets.length - uniqueAttendees
    const avgTicketsPerAttendee = uniqueAttendees > 0 ? organizerTickets.length / uniqueAttendees : 0
    const topEvents = eventPerformance.slice(0, 3).map((event) => event.eventName)

    return {
      overview: {
        totalEvents: organizerEvents.length,
        totalRevenue,
        totalAttendees,
        avgTicketPrice: Math.round(avgTicketPrice * 100) / 100,
        conversionRate,
      },
      eventPerformance,
      revenueOverTime,
      venueUsage,
      ticketSales,
      attendeeInsights: {
        totalUniqueAttendees: uniqueAttendees,
        repeatAttendees,
        avgTicketsPerAttendee: Math.round(avgTicketsPerAttendee * 100) / 100,
        topEvents,
      },
    }
  }
}
