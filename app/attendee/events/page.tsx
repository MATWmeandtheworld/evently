"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Ticket, Search, User } from "lucide-react"
import { useState, useEffect } from "react"
import { DummyDataStore } from "@/lib/data/dummy-data"
import { TicketPurchaseDialog } from "@/components/attendee/ticket-purchase-dialog"
import { MyTickets } from "@/components/attendee/my-tickets"
import { AttendeeProfile } from "@/components/profile/attendee-profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AttendeeEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("any")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // For prototype, we'll use a mock attendee ID
  const attendeeId = "550e8400-e29b-41d4-a716-446655440007"

  const fetchEvents = () => {
    const eventData = DummyDataStore.getEvents()
    const eventsWithDetails = eventData
      .filter((event) => event.is_active)
      .map((event) => DummyDataStore.getEventWithVenue(event.id))
    setEvents(eventsWithDetails.filter(Boolean))
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    let filtered = events

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue_location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Price filter
    if (priceFilter !== "any") {
      const [min, max] = priceFilter.split("-").map(Number)
      filtered = filtered.filter((event) => {
        if (max) {
          return event.ticket_price >= min && event.ticket_price <= max
        }
        return event.ticket_price >= min
      })
    }

    // Category filter (simplified for prototype)
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => {
        const eventName = event.name.toLowerCase()
        switch (categoryFilter) {
          case "tech":
            return eventName.includes("tech") || eventName.includes("summit") || eventName.includes("conference")
          case "workshop":
            return eventName.includes("workshop") || eventName.includes("creative")
          case "networking":
            return eventName.includes("networking") || eventName.includes("night")
          case "wedding":
            return eventName.includes("wedding") || eventName.includes("celebration")
          default:
            return true
        }
      })
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, priceFilter, categoryFilter])

  const handleTicketPurchase = (event: any) => {
    setSelectedEvent(event)
    setIsPurchaseDialogOpen(true)
  }

  const handlePurchaseSuccess = () => {
    setIsPurchaseDialogOpen(false)
    setSelectedEvent(null)
    fetchEvents() // Refresh to update attendee counts
  }

  const getEventCategory = (eventName: string) => {
    const name = eventName.toLowerCase()
    if (name.includes("tech") || name.includes("summit") || name.includes("conference")) return "Technology"
    if (name.includes("workshop") || name.includes("creative")) return "Workshop"
    if (name.includes("networking") || name.includes("night")) return "Networking"
    if (name.includes("wedding") || name.includes("celebration")) return "Wedding"
    return "Event"
  }

  const isEventSoldOut = (event: any) => {
    return event.current_attendees >= event.max_attendees
  }

  const getAvailableTickets = (event: any) => {
    return event.max_attendees - event.current_attendees
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Discover Events</h1>
          <p className="font-body text-lg text-gray-600">Find and attend amazing events in your area</p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="font-medium">
              Browse Events
            </TabsTrigger>
            <TabsTrigger value="tickets" className="font-medium">
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-medium">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Search & Filter Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search events, venues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any price</SelectItem>
                      <SelectItem value="0-50">Under $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="200">$200+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setCategoryFilter("all")
                      setPriceFilter("any")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">{getEventCategory(event.name)}</Badge>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">${event.ticket_price}</span>
                        {isEventSoldOut(event) && (
                          <Badge variant="destructive" className="ml-2">
                            Sold Out
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="font-heading text-lg">{event.name}</CardTitle>
                    <CardDescription className="font-body space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()} • {event.start_time} - {event.end_time}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.venue_name}, {event.venue_location}
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4" />
                        {getAvailableTickets(event)} tickets available
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((event.current_attendees / event.max_attendees) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="font-body text-gray-600">
                          {event.current_attendees}/{event.max_attendees} attending
                        </span>
                        <span className="font-body font-semibold">Organized by {event.organizer_name}</span>
                      </div>

                      {event.description && (
                        <p className="font-body text-sm text-gray-600 line-clamp-3">{event.description}</p>
                      )}

                      <Button
                        className="w-full font-medium"
                        onClick={() => handleTicketPurchase(event)}
                        disabled={isEventSoldOut(event)}
                      >
                        <Ticket className="mr-2 h-4 w-4" />
                        {isEventSoldOut(event) ? "Sold Out" : "Buy Ticket"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="font-heading text-lg font-semibold mb-2">No events found</h3>
                  <p className="font-body text-gray-600 mb-4">
                    {events.length === 0 ? "No events are currently available" : "Try adjusting your search criteria"}
                  </p>
                  {events.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setCategoryFilter("all")
                        setPriceFilter("any")
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tickets">
            <MyTickets attendeeId={attendeeId} />
          </TabsContent>

          <TabsContent value="profile">
            <AttendeeProfile />
          </TabsContent>
        </Tabs>

        {/* Ticket Purchase Dialog */}
        <TicketPurchaseDialog
          event={selectedEvent}
          attendeeId={attendeeId}
          isOpen={isPurchaseDialogOpen}
          onClose={() => setIsPurchaseDialogOpen(false)}
          onSuccess={handlePurchaseSuccess}
        />
      </div>
    </div>
  )
}
