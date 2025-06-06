"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { DummyDataStore } from "@/lib/data/dummy-data"
import type { Venue } from "@/lib/types/database"

interface VenueFormProps {
  venue?: Venue | null
  onSuccess: () => void
  onCancel: () => void
}

export function VenueForm({ venue, onSuccess, onCancel }: VenueFormProps) {
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    description: venue?.description || "",
    location: venue?.location || "",
    capacity: venue?.capacity || 0,
    price_per_day: venue?.price_per_day || 0,
    amenities: venue?.amenities || [],
    image_url: venue?.image_url || "",
    is_active: venue?.is_active ?? true,
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (venue) {
        // Update existing venue
        DummyDataStore.updateVenue(venue.id, formData)
      } else {
        // Create new venue
        DummyDataStore.addVenue({
          ...formData,
          created_by: "550e8400-e29b-41d4-a716-446655440001", // Default admin ID for prototype
        })
      }

      onSuccess()
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      })
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm font-body">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium">
            Venue Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter venue name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity" className="font-medium">
            Capacity
          </Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 0 })}
            required
            min="1"
            placeholder="Maximum capacity"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="font-medium">
          Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          placeholder="Full address of the venue"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the venue, its features, and what makes it special"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="font-medium">
            Price per Day ($)
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price_per_day}
            onChange={(e) => setFormData({ ...formData, price_per_day: Number.parseFloat(e.target.value) || 0 })}
            required
            min="0"
            step="0.01"
            placeholder="Daily rental price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url" className="font-medium">
            Image URL (Optional)
          </Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-medium">Amenities</Label>
        <div className="flex space-x-2">
          <Input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Add amenity"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
          />
          <Button type="button" onClick={addAmenity} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {amenity}
                <button type="button" onClick={() => removeAmenity(amenity)} className="ml-1 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active" className="font-medium">
          Active (visible to organizers)
        </Label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="font-medium">
          {loading ? "Saving..." : venue ? "Update Venue" : "Create Venue"}
        </Button>
      </div>
    </form>
  )
}
