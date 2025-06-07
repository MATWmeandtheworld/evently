import { DataStore } from "./DataStore"

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
  static async getAdminAnalytics(): Promise<AdminAnalytics> {
    const venues = await DataStore.getVenues()
    const events = await DataStore.getEvents()
    const bookingRequests = await DataStore.getBookingRequests()
    const tickets = await DataStore.getTickets()
    const users = await DataStore.getUsers()

    // Overview metrics
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price_paid, 0)

    // Calculate monthly user growth (by role)
    const userGrowthMap: { [month: string]: { admins: number; organizers: number; attendees: number } } = {}
    users.forEach(user => {
      const date = new Date(user.created_at)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!userGrowthMap[month]) {
        userGrowthMap[month] = { admins: 0, organizers: 0, attendees: 0 }
      }
      if (user.role === "admin") userGrowthMap[month].admins += 1
      else if (user.role === "organizer") userGrowthMap[month].organizers += 1
      else userGrowthMap[month].attendees += 1
    })
    const userGrowth = Object.entries(userGrowthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }))

    // Calculate monthly growth (percentage increase in users this month vs last)
    let monthlyGrowth = 0
    if (userGrowth.length > 1) {
      const last = userGrowth[userGrowth.length - 1].admins + userGrowth[userGrowth.length - 1].organizers + userGrowth[userGrowth.length - 1].attendees
      const prev = userGrowth[userGrowth.length - 2].admins + userGrowth[userGrowth.length - 2].organizers + userGrowth[userGrowth.length - 2].attendees
      if (prev > 0) {
        monthlyGrowth = ((last - prev) / prev) * 100
      }
    }

    // Venue performance
    const venuePerformance = venues
      .map((venue) => {
        const venueEvents = events.filter((event) => event.venue_id === venue.id)
        const venueTickets = tickets.filter((ticket) => venueEvents.some((event) => event.id === ticket.event_id))
        const revenue = venueTickets.reduce((sum, ticket) => sum + ticket.price_paid, 0)
        const bookings = venueEvents.length
        const utilizationRate = Math.min((bookings / 12) * 100, 100) // Adjust as needed

        return {
          venue: venue.name,
          bookings,
          revenue,
          utilizationRate: Math.round(utilizationRate),
        }
      })
      .sort((a, b) => b.revenue - a.revenue)

    // Event trends (group by month)
    const eventTrendsMap: { [month: string]: { events: number; revenue: number; attendees: number } } = {}
    events.forEach(event => {
      const date = new Date(event.event_date)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!eventTrendsMap[month]) {
        eventTrendsMap[month] = { events: 0, revenue: 0, attendees: 0 }
      }
      eventTrendsMap[month].events += 1
      const eventTickets = tickets.filter(t => t.event_id === event.id)
      eventTrendsMap[month].revenue += eventTickets.reduce((sum, t) => sum + t.price_paid, 0)
      eventTrendsMap[month].attendees += eventTickets.length
    })
    const eventTrends = Object.entries(eventTrendsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }))

    // Booking statistics
    const pendingRequests = bookingRequests.filter((req) => req.status === "pending").length
    const approvedRequests = bookingRequests.filter((req) => req.status === "approved").length
    const rejectedRequests = bookingRequests.filter((req) => req.status === "rejected").length
    const totalRequests = bookingRequests.length
    const approvalRate = totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0

    // Revenue by category (group by event type/category)
    const revenueByCategoryMap: { [category: string]: { revenue: number; events: number } } = {}
    events.forEach(event => {
      const category = event.category || "Other"
      if (!revenueByCategoryMap[category]) {
        revenueByCategoryMap[category] = { revenue: 0, events: 0 }
      }
      const eventTickets = tickets.filter(t => t.event_id === event.id)
      revenueByCategoryMap[category].revenue += eventTickets.reduce((sum, t) => sum + t.price_paid, 0)
      revenueByCategoryMap[category].events += 1
    })
    const totalRevenueByCategory = Object.values(revenueByCategoryMap).reduce((sum, c) => sum + c.revenue, 0)
    const revenueByCategory = Object.entries(revenueByCategoryMap).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      percentage: totalRevenueByCategory > 0 ? Math.round((data.revenue / totalRevenueByCategory) * 100) : 0,
    }))

    return {
      overview: {
        totalUsers: users.length,
        totalVenues: venues.length,
        totalEvents: events.length,
        totalRevenue,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      },
      venuePerformance,
      eventTrends,
      bookingStats: {
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        approvalRate: Math.round(approvalRate),
        avgResponseTime: 1.5, // You can calculate this if you store response times
      },
      revenueByCategory,
      userGrowth,
    }
  }

  // Organizer Analytics (remains unchanged, but you can update it similarly if needed)
  static async getOrganizerAnalytics(organizerId: string): Promise<OrganizerAnalytics> {
    const organizerEvents = await DataStore.getEventsByOrganizer(organizerId)
    const tickets = await DataStore.getTickets()
    const organizerTickets = tickets.filter((ticket) =>
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

    // Revenue over time (group by month)
    const revenueOverTimeMap: { [month: string]: { revenue: number; events: number } } = {}
    organizerEvents.forEach(event => {
      const date = new Date(event.event_date)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!revenueOverTimeMap[month]) {
        revenueOverTimeMap[month] = { revenue: 0, events: 0 }
      }
      const eventTickets = organizerTickets.filter(t => t.event_id === event.id)
      revenueOverTimeMap[month].revenue += eventTickets.reduce((sum, t) => sum + t.price_paid, 0)
      revenueOverTimeMap[month].events += 1
    })
    const revenueOverTime = Object.entries(revenueOverTimeMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }))

    // Venue usage
    const venues = await DataStore.getVenues()
    const venueUsage = venues
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

    // Ticket sales over time (group by week)
    const ticketSalesMap: { [week: string]: { sold: number; revenue: number } } = {}
    organizerTickets.forEach(ticket => {
      const date = new Date(ticket.created_at)
      const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`
      if (!ticketSalesMap[week]) {
        ticketSalesMap[week] = { sold: 0, revenue: 0 }
      }
      ticketSalesMap[week].sold += 1
      ticketSalesMap[week].revenue += ticket.price_paid
    })
    const ticketSales = Object.entries(ticketSalesMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, data]) => ({ week, ...data }))

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