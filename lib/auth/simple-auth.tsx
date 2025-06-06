"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types/database"

interface SimpleAuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined)

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("evently_user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          // Verify user still exists in database
          const { data, error } = await supabase.from("users").select("*").eq("id", userData.id).single()

          if (data && !error) {
            setUser(data)
          } else {
            localStorage.removeItem("evently_user")
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("evently_user")
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // For prototype: simple email check against database
      const { data, error } = await supabase.from("users").select("*").eq("email", email.toLowerCase().trim()).single()

      if (error || !data) {
        return { error: "Invalid email or password" }
      }

      // For prototype: we'll just check if user exists
      setUser(data)
      localStorage.setItem("evently_user", JSON.stringify(data))
      return {}
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const trimmedEmail = email.toLowerCase().trim()

      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", trimmedEmail)
        .maybeSingle()

      if (checkError) {
        console.error("Error checking existing user:", checkError)
        return { error: "Failed to check existing user" }
      }

      if (existingUser) {
        return { error: "User with this email already exists" }
      }

      // Create new user directly in database
      const { data, error } = await supabase
        .from("users")
        .insert({
          email: trimmedEmail,
          full_name: fullName.trim(),
          role: role as "admin" | "organizer" | "attendee",
        })
        .select()
        .single()

      if (error) {
        console.error("Registration error:", error)
        return { error: "Failed to create account. Please try again." }
      }

      if (!data) {
        return { error: "Failed to create account" }
      }

      // Auto sign in the new user
      setUser(data)
      localStorage.setItem("evently_user", JSON.stringify(data))
      return {}
    } catch (error) {
      console.error("Signup error:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("evently_user")
  }

  return (
    <SimpleAuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </SimpleAuthContext.Provider>
  )
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext)
  if (context === undefined) {
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider")
  }
  return context
}
