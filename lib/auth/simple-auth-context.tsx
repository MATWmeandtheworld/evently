"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types/database"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, role: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check for existing session in localStorage
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem("evently_user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Error loading saved session:", error)
        localStorage.removeItem("evently_user")
      } finally {
        setLoading(false)
      }
    }

    checkExistingSession()
  }, [])

  const signIn = async (email: string, password: string, selectedRole: string) => {
    try {
      setLoading(true)

      // Use the simple_login function
      const { data, error } = await supabase.rpc("simple_login", {
        user_email: email.trim().toLowerCase(),
        user_password: password,
      })

      if (error) {
        console.error("Login error:", error)
        return { error: "Login failed. Please try again." }
      }

      if (!data || data.length === 0) {
        return { error: "Invalid email or password" }
      }

      const userData = data[0]

      // Validate that the user's role matches the selected role
      if (userData.role !== selectedRole) {
        return { error: `This account is not registered as ${selectedRole}. Please select the correct role.` }
      }

      // Allow admin, attendee and organizer roles
      if (!["admin", "attendee", "organizer"].includes(userData.role)) {
        return { error: "Invalid user role." }
      }

      // Create user object
      const userObj: User = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role as "admin" | "organizer" | "attendee",
        phone: userData.phone,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      }

      setUser(userObj)
      localStorage.setItem("evently_user", JSON.stringify(userObj))

      return {}
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      setLoading(true)

      // Use the simple_signup function
      const { data, error } = await supabase.rpc("simple_signup", {
        user_email: email.trim().toLowerCase(),
        user_password: password,
        user_name: fullName.trim(),
        user_role: role,
      })

      if (error) {
        console.error("Signup error:", error)
        if (error.message.includes("already exists")) {
          return { error: "User with this email already exists" }
        }
        return { error: "Failed to create account. Please try again." }
      }

      if (!data || data.length === 0) {
        return { error: "Failed to create account" }
      }

      const userData = data[0]

      // Auto sign in the new user
      const userObj: User = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role as "admin" | "organizer" | "attendee",
        phone: userData.phone,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      }

      setUser(userObj)
      localStorage.setItem("evently_user", JSON.stringify(userObj))

      return {}
    } catch (error) {
      console.error("Signup error:", error)
      return { error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setUser(null)
      localStorage.removeItem("evently_user")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
