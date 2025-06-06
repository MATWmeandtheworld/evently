"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DummyDataStore } from "@/lib/data/dummy-data"
import type { Event, Venue } from "@/lib/types/database"

interface EventFormProps {
  event?: Event | null
  organizerId: string
  onSuccess: () => void
  onCancel: () => void
}

export function EventForm({ event, organizerId, onSuccess, onCancel }: EventFormProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [formData, setFormData] = useState({
    name: event?.name || "",
    description: event?.description || "",
    venue_id: event?.venue_id || "",
    event_date: event ? new Date(event.event_date) : (undefined as Date | undefined),
    start_time: event?.start_time || "",
    end_time: event?.end_time || "",
    ticket_price: event?.ticket_price || 0,
    max_attendees: event?.max_attendees || 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const venueData = DummyDataStore.getActiveVenues()
    setVenues(venueData)
  }, [])

  const selectedVenue = venues.find((v) => v.id === formData.venue_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (!formData.name.trim()) {
      setError("Event name is required")
      setLoading(false)
      return
    }

    if (!formData.venue_id) {
      setError("Please select a venue")
      setLoading(false)
      return
    }

    if (!formData.event_date) {
      setError("Event date is required")
      setLoading(false)
      return
    }

    if (!formData.start_time || !formData.end_time) {
      setError("Start and end times are required")
      setLoading(false)
      return
    }

    if (formData.max_attendees <= 0) {
      setError("Maximum attendees must be greater than 0")
      setLoading(false)
      return
    }

    if (formData.ticket_price < 0) {
      setError("Ticket price cannot be negative")
      setLoading(false)
      return
    }

    if (selectedVenue && formData.max_attendees > selectedVenue.capacity) {
      setError(`Maximum attendees cannot exceed venue capacity of ${selectedVenue.capacity}`)
      setLoading(false)
      return
    }

    // Check if start time is before end time
    const startTime = new Date(`2000-01-01T${formData.start_time}`)
    const endTime = new Date(`2000-01-01T${formData.end_time}`)
    if (startTime >= endTime) {
      setError("End time must be after start time")
      setLoading(false)
      return
    }

    try {
      if (event) {
        // Update existing event
        DummyDataStore.updateEvent(event.id, {
          ...formData,
          event_date: format(formData.event_date, "yyyy-MM-dd"),
        })
      } else {
        // Create new event
        DummyDataStore.addEvent({
          ...formData,
          organizer_id: organizerId,
          event_date: format(formData.event_date, "yyyy-MM-dd"),
          current_attendees: 0,
          is_active: true,
        })
      }

      onSuccess()
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm font-body">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="font-medium">
          Event Name *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Enter your event name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">
          Event Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your event, what attendees can expect, and any special features"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium">Venue *</Label>
        <Select value={formData.venue_id} onValueChange={(value) => setFormData({ ...formData, venue_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a venue" />
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem key={venue.id} value={venue.id}>
                <div className="flex flex-col">
                  <span>{venue.name}</span>
                  <span className="text-xs text-gray-500">
                    Capacity: {venue.capacity} • ${venue.price_per_day}/day
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedVenue && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <p className="font-body">{selectedVenue.location}</p>
            <p className="font-body">
              Capacity: {selectedVenue.capacity} • ${selectedVenue.price_per_day}/day
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-medium">Event Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.event_date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.event_date ? format(formData.event_date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.event_date}
                onSelect={(date) => setFormData({ ...formData, event_date: date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_attendees" className="font-medium">
            Maximum Attendees *
          </Label>
          <Input
            id="max_attendees"
            type="number"
            value={formData.max_attendees}
            onChange={(e) => setFormData({ ...formData, max_attendees: Number.parseInt(e.target.value) || 0 })}
            required
            min="1"
            max={selectedVenue?.capacity || undefined}
            placeholder="Maximum number of attendees"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time" className="font-medium">
            Start Time *
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time" className="font-medium">
            End Time *
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ticket_price" className="font-medium">
          Ticket Price ($) *
        </Label>
        <Input
          id="ticket_price"
          type="number"
          value={formData.ticket_price}
          onChange={(e) => setFormData({ ...formData, ticket_price: Number.parseFloat(e.target.value) || 0 })}
          required
          min="0"
          step="0.01"
          placeholder="Price per ticket"
        />
      </div>

      {!event && (
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-heading text-sm font-semibold mb-2">Event Creation Process</h4>
          <ul className="font-body text-sm text-gray-600 space-y-1">
            <li>• Your event will be published immediately after creation</li>
            <li>• Attendees can start purchasing tickets right away</li>
            <li>• You can edit event details anytime before the event date</li>
            <li>• Venue rental fees will be calculated separately</li>
          </ul>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="font-medium">
          {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
