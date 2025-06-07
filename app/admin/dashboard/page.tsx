"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, Calendar, Settings, User } from "lucide-react"
import { VenueManagement } from "@/components/admin/venue-management"
import { BookingRequestManagement } from "@/components/admin/booking-request-management"
import { AdminProfile } from "@/components/profile/admin-profile"
import { useState, useEffect } from "react"
import { DataStore } from "@/lib/data/DataStore"
import { AdminAnalyticsComponent } from "@/components/admin/admin-analytics"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVenues: 0,
    pendingRequests: 0,
    activeEvents: 0,
    totalUsers: 12,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const venues = await DataStore.getVenues()
      const requests = await DataStore.getBookingRequests()
      const events = await DataStore.getEvents()

      setStats({
        totalVenues: venues.length,
        pendingRequests: requests.filter((r) => r.status === "pending").length,
        activeEvents: events.filter((e) => e.is_active).length,
        totalUsers: 12,
      })
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="font-body text-lg text-gray-600">Manage venues and oversee platform operations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-heading text-sm font-medium">Total Venues</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stats.totalVenues}</div>
              <p className="font-body text-xs text-muted-foreground">Active venues</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-heading text-sm font-medium">Pending Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="font-body text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-heading text-sm font-medium">Active Events</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stats.activeEvents}</div>
              <p className="font-body text-xs text-muted-foreground">Ongoing events</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-heading text-sm font-medium">Total Users</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stats.totalUsers}</div>
              <p className="font-body text-xs text-muted-foreground">Platform users</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="venues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="venues" className="font-medium">
              Venue Management
            </TabsTrigger>
            <TabsTrigger value="requests" className="font-medium">
              Booking Requests
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-medium">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-medium">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venues">
            <VenueManagement />
          </TabsContent>

          <TabsContent value="requests">
            <BookingRequestManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsComponent />
          </TabsContent>

          <TabsContent value="profile">
            <AdminProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
