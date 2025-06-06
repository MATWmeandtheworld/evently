"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, CreditCard, Ticket } from "lucide-react"
import { DummyDataStore } from "@/lib/data/dummy-data"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TicketPurchaseDialogProps {
  event: any
  attendeeId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TicketPurchaseDialog({ event, attendeeId, isOpen, onClose, onSuccess }: TicketPurchaseDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!event) return null

  const totalPrice = event.ticket_price * quantity
  const availableTickets = event.max_attendees - event.current_attendees

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (quantity <= 0) {
      setError("Quantity must be at least 1")
      setLoading(false)
      return
    }

    if (quantity > availableTickets) {
      setError(`Only ${availableTickets} tickets available`)
      setLoading(false)
      return
    }

    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      setError("Please fill in all payment details")
      setLoading(false)
      return
    }

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create tickets for each quantity
      for (let i = 0; i < quantity; i++) {
        DummyDataStore.addTicket({
          event_id: event.id,
          attendee_id: attendeeId,
          purchase_date: new Date().toISOString(),
          price_paid: event.ticket_price,
          status: "active",
        })
      }

      onSuccess()
      onClose()

      // Reset form
      setQuantity(1)
      setPaymentData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
      })
    } catch (error) {
      setError("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setError("")
      setQuantity(1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Purchase Tickets</DialogTitle>
          <DialogDescription className="font-body">Complete your ticket purchase for {event.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm font-body">{error}</p>
            </div>
          )}

          {/* Event Summary */}
          <Card>
            <CardHeader>
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
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4" />
                  {availableTickets} tickets available
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-body text-lg">Ticket Price:</span>
                <span className="font-heading text-2xl font-bold text-green-600">${event.ticket_price}</span>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantity Selection */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="font-medium">
                Number of Tickets
              </Label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(availableTickets, Number.parseInt(e.target.value) || 1)))
                  }
                  min="1"
                  max={availableTickets}
                  className="w-20 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}
                  disabled={quantity >= availableTickets}
                >
                  +
                </Button>
                <span className="font-body text-sm text-gray-600">(Max: {availableTickets} available)</span>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="cardholderName" className="font-medium">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="cardNumber" className="font-medium">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="font-medium">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv" className="font-medium">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-body">Tickets ({quantity}x)</span>
                  <span className="font-body">${(event.ticket_price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body">Processing Fee</span>
                  <span className="font-body">$0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span className="font-heading">Total</span>
                  <span className="font-heading text-lg">${totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-heading text-sm font-semibold mb-2">Purchase Terms</h4>
              <ul className="font-body text-sm text-gray-600 space-y-1">
                <li>• Tickets are non-refundable</li>
                <li>• You will receive a confirmation email with your ticket details</li>
                <li>• Please bring a valid ID to the event</li>
                <li>• Tickets are transferable to other attendees</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="font-medium">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Ticket className="mr-2 h-4 w-4" />
                    Purchase ${totalPrice.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
