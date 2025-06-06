"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Check, X, Calendar, MapPin, Users, Clock } from "lucide-react"
import { DummyDataStore } from "@/lib/data/dummy-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function BookingRequestManagement() {
  const [requests, setRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const fetchRequests = () => {
    const requestData = DummyDataStore.getBookingRequests()
    const requestsWithDetails = requestData.map((request) => DummyDataStore.getBookingRequestWithDetails(request.id))
    setRequests(requestsWithDetails.filter(Boolean))
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleStatusUpdate = (requestId: string, status: "approved" | "rejected") => {
    setActionLoading(true)
    DummyDataStore.updateBookingRequestStatus(requestId, status, adminNotes)
    fetchRequests()
    setSelectedRequest(null)
    setAdminNotes("")
    setActionLoading(false)
  }

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Booking Requests</h2>
        <p className="font-body text-gray-600">Review and approve venue booking requests</p>
      </div>

      <div className="grid gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="font-heading text-lg">{request.event_name}</CardTitle>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                  <CardDescription className="font-body">Requested by {request.organizer_name}</CardDescription>
                </div>
                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approve Booking Request</DialogTitle>
                          <DialogDescription>
                            Approve "{request.event_name}" for {request.venue_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="notes">Admin Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add any notes for the organizer..."
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                              Cancel
                            </Button>
                            <Button onClick={() => handleStatusUpdate(request.id, "approved")} disabled={actionLoading}>
                              {actionLoading ? "Approving..." : "Approve"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Booking Request</DialogTitle>
                          <DialogDescription>
                            Reject "{request.event_name}" for {request.venue_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="notes">Reason for Rejection</Label>
                            <Textarea
                              id="notes"
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Please provide a reason for rejection..."
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleStatusUpdate(request.id, "rejected")}
                              disabled={actionLoading || !adminNotes.trim()}
                            >
                              {actionLoading ? "Rejecting..." : "Reject"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-body">{request.venue_name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-body">{new Date(request.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-body">
                      {request.start_time} - {request.end_time}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-body">{request.expected_attendees} expected attendees</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-body text-sm font-medium">Organizer Contact:</p>
                    <p className="font-body text-sm text-gray-600">{request.organizer_email}</p>
                    {request.organizer_phone && (
                      <p className="font-body text-sm text-gray-600">{request.organizer_phone}</p>
                    )}
                  </div>
                  {request.event_description && (
                    <div>
                      <p className="font-body text-sm font-medium">Event Description:</p>
                      <p className="font-body text-sm text-gray-600">{request.event_description}</p>
                    </div>
                  )}
                </div>
              </div>
              {request.admin_notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="font-body text-sm font-medium">Admin Notes:</p>
                  <p className="font-body text-sm text-gray-600">{request.admin_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No booking requests</h3>
            <p className="font-body text-gray-600">Booking requests will appear here when organizers submit them</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
