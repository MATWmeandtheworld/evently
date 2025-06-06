"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, MapPin, Calendar, DollarSign, Clock, CheckCircle } from "lucide-react"
import { AnalyticsService } from "@/lib/data/analytics"
import { SimpleChart } from "@/components/analytics/simple-chart"

export function AdminAnalyticsComponent() {
  const [analytics, setAnalytics] = useState<any | null>(null)

  useEffect(() => {
    const data = AnalyticsService.getAdminAnalytics()
    setAnalytics(data)
  }, [])

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Platform Analytics</h2>
        <p className="font-body text-gray-600">Comprehensive insights into platform performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold">{analytics.overview.totalUsers}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span className="font-body">+{analytics.overview.monthlyGrowth}% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium">Active Venues</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold">{analytics.overview.totalVenues}</div>
            <p className="font-body text-xs text-muted-foreground">Venues available for booking</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold">{analytics.overview.totalEvents}</div>
            <p className="font-body text-xs text-muted-foreground">Events created on platform</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span className="font-body">+{analytics.overview.monthlyGrowth}% this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="font-medium">
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="font-medium">
            Trends
          </TabsTrigger>
          <TabsTrigger value="bookings" className="font-medium">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="revenue" className="font-medium">
            Revenue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SimpleChart
              title="Top Performing Venues"
              description="Revenue generated by each venue"
              data={analytics.venuePerformance.slice(0, 5).map((venue) => ({
                label: venue.venue.split(" ")[0], // Shortened name
                value: venue.revenue,
              }))}
              type="bar"
            />

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Venue Utilization</CardTitle>
                <CardDescription className="font-body">Booking rates and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.venuePerformance.slice(0, 4).map((venue, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-body font-medium">{venue.venue}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-body">{venue.bookings} bookings</span>
                          <span className="font-body">{formatCurrency(venue.revenue)} revenue</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={venue.utilizationRate > 70 ? "default" : "secondary"}>
                          {venue.utilizationRate}% utilized
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SimpleChart
              title="Event Growth Trends"
              description="Monthly event creation and attendance"
              data={analytics.eventTrends.map((trend) => ({
                label: trend.month,
                value: trend.events,
              }))}
              type="line"
            />

            <SimpleChart
              title="User Growth"
              description="Platform user acquisition over time"
              data={analytics.userGrowth.map((growth) => ({
                label: growth.month,
                value: growth.admins + growth.organizers + growth.attendees,
              }))}
              type="line"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Monthly Performance</CardTitle>
              <CardDescription className="font-body">Detailed breakdown of platform metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-heading py-2">Month</th>
                      <th className="text-right font-heading py-2">Events</th>
                      <th className="text-right font-heading py-2">Revenue</th>
                      <th className="text-right font-heading py-2">Attendees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.eventTrends.map((trend, index) => (
                      <tr key={index} className="border-b">
                        <td className="font-body py-2">{trend.month}</td>
                        <td className="text-right font-body py-2">{trend.events}</td>
                        <td className="text-right font-body py-2">{formatCurrency(trend.revenue)}</td>
                        <td className="text-right font-body py-2">{trend.attendees}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-heading text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-2xl font-bold text-yellow-600">{analytics.bookingStats.pending}</div>
                <p className="font-body text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-heading text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-2xl font-bold text-green-600">{analytics.bookingStats.approved}</div>
                <p className="font-body text-xs text-muted-foreground">Successfully approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-heading text-sm font-medium">Approval Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-2xl font-bold text-blue-600">
                  {analytics.bookingStats.approvalRate}%
                </div>
                <p className="font-body text-xs text-muted-foreground">Overall approval rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-heading text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-2xl font-bold text-purple-600">
                  {analytics.bookingStats.avgResponseTime}d
                </div>
                <p className="font-body text-xs text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SimpleChart
              title="Revenue by Category"
              description="Revenue distribution across event categories"
              data={analytics.revenueByCategory.map((category) => ({
                label: category.category,
                value: category.revenue,
              }))}
              type="pie"
            />

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Revenue Breakdown</CardTitle>
                <CardDescription className="font-body">Detailed revenue analysis by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenueByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <span className="font-body font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-heading font-semibold">{formatCurrency(category.revenue)}</div>
                        <div className="text-sm text-gray-600 font-body">{category.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
