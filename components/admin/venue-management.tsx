"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin, Users, DollarSign } from "lucide-react"
import { DataStore } from "@/lib/data/DataStore"
import type { Venue } from "@/lib/types/database"
import { VenueForm } from "./venue-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function VenueManagement() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchVenues = async () => {
    const venueData = await DataStore.getVenues()
    setVenues(venueData)
  }

  useEffect(() => {
    fetchVenues()
  }, [])

  const handleVenueCreated = () => {
    fetchVenues()
    setIsFormOpen(false)
  }

  const handleVenueUpdated = () => {
    fetchVenues()
    setIsFormOpen(false)
    setSelectedVenue(null)
  }

  const handleDeleteVenue = (venueId: string) => {
    DataStore.deleteVenue(venueId)
    fetchVenues()
  }

  const handleEditVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setIsFormOpen(true)
  }

  const handleAddVenue = () => {
    setSelectedVenue(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Venue Management</h2>
          <p className="font-body text-gray-600">Add, edit, and manage venue listings</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddVenue} className="font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Add Venue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{selectedVenue ? "Edit Venue" : "Add New Venue"}</DialogTitle>
              <DialogDescription className="font-body">
                {selectedVenue ? "Update venue information" : "Create a new venue listing"}
              </DialogDescription>
            </DialogHeader>
            <VenueForm
              venue={selectedVenue}
              onSuccess={selectedVenue ? handleVenueUpdated : handleVenueCreated}
              onCancel={() => {
                setIsFormOpen(false)
                setSelectedVenue(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <Card key={venue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant={venue.is_active ? "default" : "secondary"}>
                  {venue.is_active ? "Active" : "Inactive"}
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditVenue(venue)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Venue</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{venue.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteVenue(venue.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4" />
                    <span className="font-body">Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center text-sm font-semibold">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span>${venue.price_per_day}/day</span>
                  </div>
                </div>

                {venue.amenities && venue.amenities.length > 0 && (
                  <div>
                    <p className="font-body text-sm font-medium mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {venue.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{venue.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {venue.description && (
                  <p className="font-body text-sm text-gray-600 line-clamp-2">{venue.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {venues.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No venues yet</h3>
            <p className="font-body text-gray-600 mb-4">Get started by adding your first venue</p>
            <Button onClick={handleAddVenue} className="font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Venue
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
