"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, DollarSign, User } from "lucide-react"
import { VenueBrowser } from "@/components/organizer/venue-browser"
import { EventManagement } from "@/components/organizer/event-management"
import { BookingHistory } from "@/components/organizer/booking-history"
import { OrganizerProfile } from "@/components/profile/organizer-profile"
import { useState, useEffect } from "react"
import { DataStore } from "@/lib/data/DataStore"
import { OrganizerAnalyticsComponent } from "@/components/organizer/organizer-analytics"

export default function OrganizerDashboard() {
  const [stats, setStats] = useState({
    myEvents: 0,
    venueBookings: 2,
    totalAttendees: 0,
    revenue: 0,
  })

  // For prototype, we'll use a mock organizer ID
  const organizerId = "550e8400-e29b-41d4-a716-446655440003"

  useEffect(() => {
    const fetchStats = async () => {
      const events = await DataStore.getEventsByOrganizer(organizerId)
      const totalAttendees = events.reduce((sum, event) => sum + event.current_attendees, 0)
      const revenue = events.reduce((sum, event) => sum + event.ticket_price * event.current_attendees, 0)

      setStats({
        myEvents: events.length,
        venueBookings: 2, // Mock data
        totalAttendees,
        revenue,
      })
    }
    fetchStats()
  }, [organizerId])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Organizer Dashboard</h1>
          <p className="font-body text-lg text-gray-600">Manage your events and venue bookings</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-heading text-sm font-medium">My Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stats.myEvents}</div>
              <p className="font-body text-xs text-muted-foreground">Active events</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-heading text-sm font-medium">Venue Bookings</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stats.venueBookings}</div>
              <p className="font-body text-xs text-muted-foreground">Confirmed bookings</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-heading text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stats.totalAttendees}</div>
              <p className="font-body text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-heading text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              <p className="font-body text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="venues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="venues" className="font-medium">
              Browse Venues
            </TabsTrigger>
            <TabsTrigger value="events" className="font-medium">
              My Events
            </TabsTrigger>
            <TabsTrigger value="bookings" className="font-medium">
              Booking History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-medium">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-medium">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venues">
            <VenueBrowser organizerId={organizerId} />
          </TabsContent>

          <TabsContent value="events">
            <EventManagement organizerId={organizerId} />
            
          </TabsContent>

          <TabsContent value="bookings">
            <BookingHistory organizerId={organizerId} />
          </TabsContent>

          <TabsContent value="analytics">
            <OrganizerAnalyticsComponent organizerId={organizerId} />
          </TabsContent>

          <TabsContent value="profile">
            <OrganizerProfile />
          </TabsContent>
        </Tabs>
        
      </div>
      
    </div>
  )

  console.log("Organizer Profile ID passed to EventManagement:", organizerId);
}

