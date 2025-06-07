"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DataStore } from "@/lib/data/DataStore"
import type { Venue } from "@/lib/types/database"

interface BookingRequestFormProps {
  venue: Venue
  organizerId: string
  onSuccess: () => void
  onCancel: () => void
}

export function BookingRequestForm({ venue, organizerId, onSuccess, onCancel }: BookingRequestFormProps) {
  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    event_date: undefined as Date | undefined,
    start_time: "",
    end_time: "",
    expected_attendees: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (!formData.event_name.trim()) {
      setError("Event name is required")
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

    if (formData.expected_attendees <= 0) {
      setError("Expected attendees must be greater than 0")
      setLoading(false)
      return
    }

    if (formData.expected_attendees > venue.capacity) {
      setError(`Expected attendees cannot exceed venue capacity of ${venue.capacity}`)
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
      DataStore.addBookingRequest({
        organizer_id: organizerId,
        venue_id: venue.id,
        event_name: formData.event_name.trim(),
        event_description: formData.event_description.trim(),
        event_date: format(formData.event_date, "yyyy-MM-dd"),
        start_time: formData.start_time,
        end_time: formData.end_time,
        expected_attendees: formData.expected_attendees,
      })

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

      {/* Venue Info */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-heading text-lg font-semibold mb-2">{venue.name}</h3>
        <p className="font-body text-sm text-gray-600 mb-2">{venue.location}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-body">Capacity: {venue.capacity}</span>
          <span className="font-body font-semibold">${venue.price_per_day}/day</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event_name" className="font-medium">
          Event Name *
        </Label>
        <Input
          id="event_name"
          value={formData.event_name}
          onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
          required
          placeholder="Enter your event name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event_description" className="font-medium">
          Event Description
        </Label>
        <Textarea
          id="event_description"
          value={formData.event_description}
          onChange={(e) => setFormData({ ...formData, event_description: e.target.value })}
          placeholder="Describe your event, its purpose, and any special requirements"
          rows={3}
        />
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
              onSelect={(date: Date | undefined) => setFormData({ ...formData, event_date: date })}
              disabled={(date: Date) => date < new Date()}
              initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected_attendees" className="font-medium">
            Expected Attendees *
          </Label>
          <Input
            id="expected_attendees"
            type="number"
            value={formData.expected_attendees}
            onChange={(e) => setFormData({ ...formData, expected_attendees: Number.parseInt(e.target.value) || 0 })}
            required
            min="1"
            max={venue.capacity}
            placeholder="Number of attendees"
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

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="font-heading text-sm font-semibold mb-2">Booking Process</h4>
        <ul className="font-body text-sm text-gray-600 space-y-1">
          <li>• Your booking request will be reviewed by our admin team</li>
          <li>• You'll receive a response within 24-48 hours</li>
          <li>• Once approved, you can create your event and start selling tickets</li>
          <li>• Venue rental fee: ${venue.price_per_day} per day</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="font-medium">
          {loading ? "Submitting..." : "Submit Booking Request"}
        </Button>
      </div>
    </form>
  )
}
