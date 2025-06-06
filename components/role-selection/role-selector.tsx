"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Ticket, ArrowRight } from "lucide-react"
import { useRole } from "@/lib/context/role-context"
import { useRouter } from "next/navigation"

export function RoleSelector() {
  const { setRole } = useRole()
  const router = useRouter()

  const handleRoleSelect = (selectedRole: "admin" | "organizer" | "attendee") => {
    setRole(selectedRole)

    // Redirect to appropriate dashboard
    switch (selectedRole) {
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

  const roles = [
    {
      id: "admin" as const,
      title: "Administrator",
      description: "Manage venues and approve booking requests",
      icon: MapPin,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      iconColor: "text-red-600",
      features: [
        "Manage venue listings",
        "Approve booking requests",
        "Monitor platform activity",
        "Maintain venue details",
      ],
    },
    {
      id: "organizer" as const,
      title: "Event Organizer",
      description: "Create and manage events, book venues",
      icon: Users,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconColor: "text-blue-600",
      features: [
        "Browse and book venues",
        "Create and manage events",
        "Track ticket sales",
        "Communicate with attendees",
      ],
    },
    {
      id: "attendee" as const,
      title: "Event Attendee",
      description: "Discover and attend amazing events",
      icon: Ticket,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      iconColor: "text-green-600",
      features: ["Browse upcoming events", "Purchase tickets instantly", "View event details", "Manage your tickets"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-bold text-gray-900 mb-6 text-balance">
            Welcome to <span className="text-blue-600">Evently</span>
          </h1>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-balance">
            Choose your role to explore the platform. This is a prototype, so you can switch between roles anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Card
                key={role.id}
                className={`${role.color} transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl border-2`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className={`h-8 w-8 ${role.iconColor}`} />
                  </div>
                  <CardTitle className="font-heading text-xl">{role.title}</CardTitle>
                  <CardDescription className="font-body text-gray-600">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700 font-body">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full font-medium" onClick={() => handleRoleSelect(role.id)}>
                    Continue as {role.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 font-body">
            This is a prototype system. You can switch between roles at any time using the navigation menu.
          </p>
        </div>
      </div>
    </div>
  )
}
