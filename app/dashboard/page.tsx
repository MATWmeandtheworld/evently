"use client"

import { useAuth } from "@/lib/auth/simple-auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      // Redirect to role-specific dashboard
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
        default:
          router.push("/")
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="font-body text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
