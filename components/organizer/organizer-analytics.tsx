"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Calendar, DollarSign, Ticket, Target, Award, MapPin } from "lucide-react"
import { AnalyticsService, OrganizerAnalytics } from "@/lib/data/analytics"
import { SimpleChart } from "@/components/analytics/simple-chart"

interface OrganizerAnalyticsProps {
  organizerId: string
}

interface EventPerformance {
  eventName: string
  revenue: number
  ticketsSold: number
  attendanceRate: number
}

interface TicketSale {
  week: string
  sold: number
}

interface RevenueOverTime {
  month: string
  events: number
  revenue: number
}

export function OrganizerAnalyticsComponent({ organizerId }: OrganizerAnalyticsProps) {
  const [analytics, setAnalytics] = useState<OrganizerAnalytics | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await AnalyticsService.getOrganizerAnalytics(organizerId)
      setAnalytics(data)
    }
    fetchData()
  }, [organizerId])

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
        <h2 className="font-heading text-2xl font-semibold">My Analytics</h2>
        <p className="font-body text-gray-600">Track your event performance and revenue</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold">{analytics.overview.totalEvents}</div>
            <p className="font-body text-xs text-muted-foreground">Events organized</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span className="font-body">Growing steadily</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold">{analytics.overview.totalAttendees}</div>
            <p className="font-body text-xs text-muted-foreground">Tickets sold</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium">Avg Ticket Price</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-bold">{formatCurrency(analytics.overview.avgTicketPrice)}</div>
            <p className="font-body text-xs text-muted-foreground">Average price per ticket</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="font-medium">
            Performance
          </TabsTrigger>
          <TabsTrigger value="revenue" className="font-medium">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="venues" className="font-medium">
            Venues
          </TabsTrigger>
          <TabsTrigger value="insights" className="font-medium">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SimpleChart
              title="Event Performance"
              description="Revenue generated by each event"
              data={analytics.eventPerformance.slice(0, 5).map((event: EventPerformance) => ({
                label: event.eventName.split(" ")[0],
                value: event.revenue,
              }))}
              type="bar"
            />

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Event Details</CardTitle>
                <CardDescription className="font-body">Performance metrics for your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.eventPerformance.slice(0, 4).map((event: EventPerformance, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-body font-medium">{event.eventName}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-body">{event.ticketsSold} tickets</span>
                          <span className="font-body">{formatCurrency(event.revenue)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={event.attendanceRate > 80 ? "default" : "secondary"}>
                          {event.attendanceRate}% sold
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Key Performance Indicators</CardTitle>
              <CardDescription className="font-body">Important metrics for your events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="font-display text-2xl font-bold">{analytics.overview.conversionRate}%</div>
                  <p className="font-body text-sm text-gray-600">Conversion Rate</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="font-display text-2xl font-bold">
                    {analytics.attendeeInsights.totalUniqueAttendees}
                  </div>
                  <p className="font-body text-sm text-gray-600">Unique Attendees</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="font-display text-2xl font-bold">
                    {analytics.attendeeInsights.avgTicketsPerAttendee}
                  </div>
                  <p className="font-body text-sm text-gray-600">Avg Tickets/Attendee</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SimpleChart
              title="Revenue Over Time"
              description="Monthly revenue growth"
              data={analytics.revenueOverTime.map(
                (revenue: RevenueOverTime) => ({
                  label: revenue.month,
                  value: revenue.revenue,
                })
              )}
              type="line"
            />

            <SimpleChart
              title="Weekly Ticket Sales"
              description="Recent ticket sales performance"
              data={analytics.ticketSales.map(
                (sale: TicketSale) => ({
                  label: sale.week,
                  value: sale.sold,
                })
              )}
              type="bar"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Revenue Breakdown</CardTitle>
              <CardDescription className="font-body">Monthly revenue and event details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-heading py-2">Month</th>
                      <th className="text-right font-heading py-2">Events</th>
                      <th className="text-right font-heading py-2">Revenue</th>
                      <th className="text-right font-heading py-2">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.revenueOverTime.map((revenue: RevenueOverTime, index: number) => {
                      const prevRevenue = index > 0 ? analytics.revenueOverTime[index - 1].revenue : revenue.revenue
                      const growth: number = prevRevenue > 0 ? ((revenue.revenue - prevRevenue) / prevRevenue) * 100 : 0

                      return (
                        <tr key={index} className="border-b">
                          <td className="font-body py-2">{revenue.month}</td>
                          <td className="text-right font-body py-2">{revenue.events}</td>
                          <td className="text-right font-body py-2">{formatCurrency(revenue.revenue)}</td>
                          <td className="text-right font-body py-2">
                            <span className={growth >= 0 ? "text-green-600" : "text-red-600"}>
                              {growth >= 0 ? "+" : ""}
                              {growth.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venues" className="space-y-6">
          <SimpleChart
            title="Venue Usage"
            description="Revenue generated at each venue"
            data={analytics.venueUsage.map((venue) => ({
              label: venue.venue.split(" ")[0],
              value: venue.totalRevenue,
            }))}
            type="bar"
          />

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Venue Performance</CardTitle>
              <CardDescription className="font-body">Detailed breakdown of venue usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.venueUsage.map((venue, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-body font-medium">{venue.venue}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="font-body">{venue.timesUsed} events</span>
                        <span className="font-body">{venue.avgAttendees} avg attendees</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-heading font-semibold">{formatCurrency(venue.totalRevenue)}</div>
                      <div className="text-sm text-gray-600 font-body">Total revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Attendee Insights</CardTitle>
                <CardDescription className="font-body">Understanding your audience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body">Total Unique Attendees</span>
                  <span className="font-heading font-semibold">{analytics.attendeeInsights.totalUniqueAttendees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body">Repeat Attendees</span>
                  <span className="font-heading font-semibold">{analytics.attendeeInsights.repeatAttendees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body">Avg Tickets per Attendee</span>
                  <span className="font-heading font-semibold">{analytics.attendeeInsights.avgTicketsPerAttendee}</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="font-body text-sm font-medium mb-2">Top Performing Events:</p>
                  <ul className="space-y-1">
                    {analytics.attendeeInsights.topEvents.map((event, index) => (
                      <li key={index} className="font-body text-sm text-gray-600">
                        {index + 1}. {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Performance Tips</CardTitle>
                <CardDescription className="font-body">Recommendations to improve your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-body text-sm font-medium text-blue-800">Pricing Strategy</p>
                    <p className="font-body text-xs text-blue-600 mt-1">
                      Your average ticket price of {formatCurrency(analytics.overview.avgTicketPrice)} is competitive. Consider premium
                      tiers for higher revenue.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-body text-sm font-medium text-green-800">Venue Selection</p>
                    <p className="font-body text-xs text-green-600 mt-1">
                      Your most successful venue generates{" "}
                      {analytics.venueUsage[0]?.totalRevenue
                        ? formatCurrency(analytics.venueUsage[0].totalRevenue)
                        : "$0"}
                      . Consider booking similar venues.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-body text-sm font-medium text-purple-800">Audience Engagement</p>
                    <p className="font-body text-xs text-purple-600 mt-1">
                      {analytics.attendeeInsights.repeatAttendees} repeat attendees show strong loyalty. Focus on
                      retention strategies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}