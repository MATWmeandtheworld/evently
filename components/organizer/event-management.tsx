"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Calendar, MapPin, Users, DollarSign, Ticket } from "lucide-react"
import { DataStore } from "@/lib/data/DataStore"
import type { Event } from "@/lib/types/database"
import { EventForm } from "./event-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EventManagementProps {
  organizerId: string
}

export function EventManagement({ organizerId }: EventManagementProps) {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchEvents = async () => {
  const eventData = await DataStore.getEventsByOrganizer(organizerId)
  const eventsWithDetails = await Promise.all(
    eventData.map((event) => DataStore.getEventWithVenue(event.id))
  )
  setEvents(eventsWithDetails.filter(Boolean))
}

  useEffect(() => {
    fetchEvents()
  }, [organizerId])

  const handleEventCreated = () => {
    fetchEvents()
    setIsFormOpen(false)
  }

  const handleEventUpdated = () => {
    fetchEvents()
    setIsFormOpen(false)
    setSelectedEvent(null)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsFormOpen(true)
  }

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setIsFormOpen(true)
  }

  const getEventStatus = (event: any) => {
    const eventDate = new Date(event.event_date)
    const today = new Date()

    if (eventDate < today) {
      return { label: "Completed", color: "bg-gray-100 text-gray-800" }
    } else if (eventDate.toDateString() === today.toDateString()) {
      return { label: "Today", color: "bg-green-100 text-green-800" }
    } else {
      return { label: "Upcoming", color: "bg-blue-100 text-blue-800" }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-2xl font-semibold">My Events</h2>
          <p className="font-body text-gray-600">Create and manage your events</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddEvent} className="font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{selectedEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
              <DialogDescription className="font-body">
                {selectedEvent ? "Update event information" : "Create a new event for your audience"}
              </DialogDescription>
            </DialogHeader>
            <EventForm
              event={selectedEvent}
              organizerId={organizerId}
              onSuccess={selectedEvent ? handleEventUpdated : handleEventCreated}
              onCancel={() => {
                setIsFormOpen(false)
                setSelectedEvent(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const status = getEventStatus(event)
          return (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={status.color}>{status.label}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => handleEditEvent(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="font-heading text-lg">{event.name}</CardTitle>
                <CardDescription className="font-body space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(event.event_date).toLocaleDateString()} • {event.start_time} - {event.end_time}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.venue_name}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4" />
                      <span className="font-body">
                        {event.current_attendees}/{event.max_attendees}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-semibold">
                      <DollarSign className="mr-1 h-4 w-4" />
                      <span>${event.ticket_price}</span>
                    </div>
                  </div>

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
                      {event.max_attendees - event.current_attendees} tickets left
                    </span>
                    <span className="font-body font-semibold">
                      ${(event.ticket_price * event.current_attendees).toLocaleString()} revenue
                    </span>
                  </div>

                  {event.description && (
                    <p className="font-body text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  )}

                  <div className="flex space-x-2">
                    <Button variant={"outline"} size={"sm"} className="flex-1">
                      <Ticket className="mr-1 h-4 w-4" />
                      View Tickets
                    </Button>
                    <Button variant={"outline"} size={"sm"} className="flex-1">
                      <Users className="mr-1 h-4 w-4" />
                      Attendees
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {events.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No events yet</h3>
            <p className="font-body text-gray-600 mb-4">Create your first event to get started</p>
            <Button onClick={handleAddEvent} className="font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
