"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TestCredentialsProps {
  onTestLogin?: (email: string, password?: string) => void
  loading?: boolean
}

export function TestCredentials({ onTestLogin, loading }: TestCredentialsProps) {
  const testUsers = [
    {
      role: "Admin",
      email: "admin@evently.com",
      password: "password123",
      name: "System Administrator",
      color: "bg-red-100 text-red-800",
    },
    {
      role: "Organizer",
      email: "john.organizer@evently.com",
      password: "password123",
      name: "John Smith",
      color: "bg-blue-100 text-blue-800",
    },
    {
      role: "Attendee",
      email: "alex.attendee@evently.com",
      password: "password123",
      name: "Alex Thompson",
      color: "bg-green-100 text-green-800",
    },
  ]

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-sm font-heading">Test Credentials</CardTitle>
        <CardDescription className="text-xs font-body">
          Use these pre-created accounts to test the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {testUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge className={user.color}>{user.role}</Badge>
                <span className="text-sm font-medium font-body">{user.name}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 font-body">{user.email}</p>
              <p className="text-xs text-gray-500 font-body">Password: {user.password}</p>
            </div>
            {onTestLogin && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTestLogin(user.email, user.password)}
                disabled={loading}
                className="ml-2"
              >
                {loading ? "..." : "Login"}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
