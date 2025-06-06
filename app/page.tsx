"use client"

import { useAuth } from "@/lib/auth/simple-auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, Ticket, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is logged in, redirect to their dashboard
    if (user && !loading) {
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "organizer":
          router.push("/organizer/dashboard")
          break
        case "attendee":
          router.push("/attendee/events")
          break
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="font-body text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is logged in, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="font-body text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-display text-6xl font-bold text-gray-900 mb-6 text-balance">
            Welcome to <span className="text-blue-600">Evently</span>
          </h1>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-balance mb-12">
            The complete event management platform that connects organizers, venues, and attendees. Create memorable
            experiences with our streamlined booking and ticketing system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="font-medium text-lg px-8 py-3">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="font-medium text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Everything you need to manage events</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="font-heading text-xl">For Administrators</CardTitle>
                <CardDescription className="font-body">Manage venues and approve bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm font-body">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Venue management system
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Booking request approval
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Platform analytics
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    User management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="font-heading text-xl">For Organizers</CardTitle>
                <CardDescription className="font-body">Create and manage amazing events</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm font-body">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Browse and book venues
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Event creation tools
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Ticket sales tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Revenue analytics
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Ticket className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="font-heading text-xl">For Attendees</CardTitle>
                <CardDescription className="font-body">Discover and attend events</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm font-body">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Browse upcoming events
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Secure ticket purchasing
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Digital ticket management
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    Event notifications
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="font-body text-lg text-gray-600 mb-8">
            Join thousands of event organizers and attendees who trust Evently for their event management needs.
          </p>
          <Link href="/register">
            <Button size="lg" className="font-medium text-lg px-8 py-3">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
