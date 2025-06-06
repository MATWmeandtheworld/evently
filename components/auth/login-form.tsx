"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/simple-auth-context"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<"admin" | "attendee" | "organizer">("attendee")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email.trim()) {
      setError("Please enter your email")
      setLoading(false)
      return
    }

    if (!password) {
      setError("Please enter your password")
      setLoading(false)
      return
    }

    if (!selectedRole) {
      setError("Please select your role")
      setLoading(false)
      return
    }

    try {
      const { error: signInError } = await signIn(email, password, selectedRole)

      if (signInError) {
        setError(signInError)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTestLogin = async (
    testEmail: string,
    testRole: "admin" | "attendee" | "organizer",
    testPassword = "password123",
  ) => {
    setLoading(true)
    setError("")
    setEmail(testEmail)
    setPassword(testPassword)
    setSelectedRole(testRole)

    try {
      const { error: signInError } = await signIn(testEmail, testPassword, testRole)

      if (signInError) {
        setError(signInError)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In to Evently</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value: "admin" | "attendee" | "organizer") => setSelectedRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="attendee">Attendee</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            </div>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Test Accounts:</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestLogin("admin@evently.com", "admin")}
                disabled={loading}
                className="w-full text-left justify-start"
              >
                <span className="font-medium">Admin:</span>
                <span className="ml-2 text-gray-600">admin@evently.com</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestLogin("john.organizer@evently.com", "organizer")}
                disabled={loading}
                className="w-full text-left justify-start"
              >
                <span className="font-medium">Organizer:</span>
                <span className="ml-2 text-gray-600">john.organizer@evently.com</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestLogin("alex.attendee@evently.com", "attendee")}
                disabled={loading}
                className="w-full text-left justify-start"
              >
                <span className="font-medium">Attendee:</span>
                <span className="ml-2 text-gray-600">alex.attendee@evently.com</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">All test accounts use password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
