"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, DollarSign, Search, Calendar } from "lucide-react"
import { DummyDataStore } from "@/lib/data/dummy-data"
import type { Venue } from "@/lib/types/database"
import { BookingRequestForm } from "./booking-request-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface VenueBrowserProps {
  organizerId: string
}

export function VenueBrowser({ organizerId }: VenueBrowserProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [capacityFilter, setCapacityFilter] = useState("any")
  const [priceFilter, setPriceFilter] = useState("any")

  useEffect(() => {
    const venueData = DummyDataStore.getActiveVenues()
    setVenues(venueData)
    setFilteredVenues(venueData)
  }, [])

  useEffect(() => {
    let filtered = venues

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.amenities.some((amenity) => amenity.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Capacity filter
    if (capacityFilter !== "any") {
      const [min, max] = capacityFilter.split("-").map(Number)
      filtered = filtered.filter((venue) => {
        if (max) {
          return venue.capacity >= min && venue.capacity <= max
        }
        return venue.capacity >= min
      })
    }

    // Price filter
    if (priceFilter !== "any") {
      const [min, max] = priceFilter.split("-").map(Number)
      filtered = filtered.filter((venue) => {
        if (max) {
          return venue.price_per_day >= min && venue.price_per_day <= max
        }
        return venue.price_per_day >= min
      })
    }

    setFilteredVenues(filtered)
  }, [venues, searchTerm, capacityFilter, priceFilter])

  const handleBookVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setIsBookingFormOpen(true)
  }

  const handleBookingSuccess = () => {
    setIsBookingFormOpen(false)
    setSelectedVenue(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Browse Venues</h2>
          <p className="font-body text-gray-600">Find the perfect venue for your event</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search venues, locations, amenities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any capacity</SelectItem>
                <SelectItem value="0-50">Up to 50</SelectItem>
                <SelectItem value="51-200">51 - 200</SelectItem>
                <SelectItem value="201-500">201 - 500</SelectItem>
                <SelectItem value="501">500+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any price</SelectItem>
                <SelectItem value="0-1000">Under $1,000</SelectItem>
                <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                <SelectItem value="5000">$5,000+</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCapacityFilter("any")
                setPriceFilter("any")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Venue Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-video bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                {venue.image_url ? (
                  <img
                    src={venue.image_url || "/placeholder.svg"}
                    alt={venue.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <MapPin className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <CardTitle className="font-heading text-lg">{venue.name}</CardTitle>
              <CardDescription className="font-body">
                <div className="flex items-center text-sm mb-2">
                  <MapPin className="mr-2 h-4 w-4" />
                  {venue.location}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4" />
                    <span className="font-body">Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center text-lg font-bold text-green-600">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span>{venue.price_per_day}/day</span>
                  </div>
                </div>

                {venue.amenities && venue.amenities.length > 0 && (
                  <div>
                    <p className="font-body text-sm font-medium mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {venue.amenities.slice(0, 4).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {venue.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{venue.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {venue.description && (
                  <p className="font-body text-sm text-gray-600 line-clamp-3">{venue.description}</p>
                )}

                <Dialog open={isBookingFormOpen && selectedVenue?.id === venue.id} onOpenChange={setIsBookingFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full font-medium" onClick={() => handleBookVenue(venue)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Request Booking
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-heading">Request Venue Booking</DialogTitle>
                      <DialogDescription className="font-body">
                        Submit a booking request for {selectedVenue?.name}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedVenue && (
                      <BookingRequestForm
                        venue={selectedVenue}
                        organizerId={organizerId}
                        onSuccess={handleBookingSuccess}
                        onCancel={() => setIsBookingFormOpen(false)}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No venues found</h3>
            <p className="font-body text-gray-600 mb-4">
              {venues.length === 0 ? "No venues are currently available" : "Try adjusting your search criteria"}
            </p>
            {venues.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setCapacityFilter("any")
                  setPriceFilter("any")
                }}
              >
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
