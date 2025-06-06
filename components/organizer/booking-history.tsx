"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { DummyDataStore } from "@/lib/data/dummy-data"

interface BookingHistoryProps {
  organizerId: string
}

export function BookingHistory({ organizerId }: BookingHistoryProps) {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const bookingData = DummyDataStore.getBookingRequests()
    const organizerBookings = bookingData.filter((booking) => booking.organizer_id === organizerId)
    const bookingsWithDetails = organizerBookings.map((booking) =>
      DummyDataStore.getBookingRequestWithDetails(booking.id),
    )
    setBookings(bookingsWithDetails.filter(Boolean))
  }, [organizerId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Your booking request is being reviewed by our admin team"
      case "approved":
        return "Your booking has been approved! You can now create your event"
      case "rejected":
        return "Your booking request was not approved"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Booking History</h2>
        <p className="font-body text-gray-600">Track your venue booking requests and their status</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="font-heading text-lg">{booking.event_name}</CardTitle>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                  <CardDescription className="font-body">{getStatusDescription(booking.status)}</CardDescription>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p className="font-body">Submitted</p>
                  <p className="font-body">{new Date(booking.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-body font-medium">{booking.venue_name}</p>
                      <p className="font-body text-gray-600 text-xs">{booking.venue_location}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-body">{new Date(booking.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-body">
                      {booking.start_time} - {booking.end_time}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-body">{booking.expected_attendees} expected attendees</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-body text-sm font-medium">Venue Details:</p>
                    <p className="font-body text-sm text-gray-600">Capacity: {booking.venue_capacity}</p>
                    <p className="font-body text-sm text-gray-600">${booking.venue_price}/day</p>
                  </div>
                  {booking.event_description && (
                    <div>
                      <p className="font-body text-sm font-medium">Event Description:</p>
                      <p className="font-body text-sm text-gray-600">{booking.event_description}</p>
                    </div>
                  )}
                </div>
              </div>
              {booking.admin_notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="font-body text-sm font-medium">Admin Response:</p>
                  <p className="font-body text-sm text-gray-600">{booking.admin_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No booking requests yet</h3>
            <p className="font-body text-gray-600">
              Start by browsing venues and submitting your first booking request
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
