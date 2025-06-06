"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Ticket, Download, QrCode } from "lucide-react"
import { DummyDataStore } from "@/lib/data/dummy-data"

interface MyTicketsProps {
  attendeeId: string
}

export function MyTickets({ attendeeId }: MyTicketsProps) {
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    const ticketData = DummyDataStore.getTicketsByAttendee(attendeeId)
    const ticketsWithDetails = ticketData.map((ticket) => {
      const event = DummyDataStore.getEventWithVenue(ticket.event_id)
      return {
        ...ticket,
        ...event,
      }
    })
    setTickets(ticketsWithDetails.filter(Boolean))
  }, [attendeeId])

  const getTicketStatus = (ticket: any) => {
    const eventDate = new Date(ticket.event_date)
    const today = new Date()

    if (ticket.status === "cancelled") {
      return { label: "Cancelled", color: "bg-red-100 text-red-800" }
    } else if (ticket.status === "used") {
      return { label: "Used", color: "bg-gray-100 text-gray-800" }
    } else if (eventDate < today) {
      return { label: "Expired", color: "bg-gray-100 text-gray-800" }
    } else if (eventDate.toDateString() === today.toDateString()) {
      return { label: "Today", color: "bg-green-100 text-green-800" }
    } else {
      return { label: "Active", color: "bg-blue-100 text-blue-800" }
    }
  }

  const handleDownloadTicket = (ticket: any) => {
    // Simulate ticket download
    const ticketData = {
      ticketCode: ticket.ticket_code,
      eventName: ticket.name,
      eventDate: ticket.event_date,
      eventTime: `${ticket.start_time} - ${ticket.end_time}`,
      venue: ticket.venue_name,
      location: ticket.venue_location,
      price: ticket.price_paid,
    }

    const dataStr = JSON.stringify(ticketData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ticket-${ticket.ticket_code}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold">My Tickets</h2>
        <p className="font-body text-gray-600">View and manage your purchased event tickets</p>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => {
          const status = getTicketStatus(ticket)
          return (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="font-heading text-lg">{ticket.name}</CardTitle>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                    <CardDescription className="font-body">
                      Ticket Code: <span className="font-mono font-semibold">{ticket.ticket_code}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm text-gray-500">Purchased</p>
                    <p className="font-body text-sm">{new Date(ticket.purchase_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="font-body">
                        {new Date(ticket.event_date).toLocaleDateString()} • {ticket.start_time} - {ticket.end_time}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-body font-medium">{ticket.venue_name}</p>
                        <p className="font-body text-gray-600 text-xs">{ticket.venue_location}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="font-body">Organized by {ticket.organizer_name}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm">Price Paid:</span>
                      <span className="font-heading text-lg font-semibold">${ticket.price_paid}</span>
                    </div>
                    {ticket.description && (
                      <div>
                        <p className="font-body text-sm font-medium">Event Description:</p>
                        <p className="font-body text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {status.label === "Active" ||
                  (status.label === "Today" && (
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownloadTicket(ticket)}>
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <QrCode className="mr-1 h-4 w-4" />
                        Show QR Code
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {tickets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No tickets yet</h3>
            <p className="font-body text-gray-600">Browse events and purchase your first ticket to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
