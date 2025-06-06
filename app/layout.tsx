import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth/simple-auth-context"
import { RoleProvider } from "@/lib/context/role-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Evently - Event Management Platform",
  description: "Manage events, venues, and bookings with ease",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RoleProvider>{children}</RoleProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
