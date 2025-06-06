"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types/database"

interface PrototypeAuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string) => Promise<{ error?: string }>
  signUp: (email: string, fullName: string, role: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const PrototypeAuthContext = createContext<PrototypeAuthContextType | undefined>(undefined)

export function PrototypeAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("evently_prototype_user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("evently_prototype_user")
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const signIn = async (email: string) => {
    try {
      const trimmedEmail = email.toLowerCase().trim()

      // Use a direct query with explicit RPC call to bypass RLS
      const { data, error } = await supabase.rpc("get_user_by_email", { user_email: trimmedEmail })

      if (error) {
        console.error("Sign in error:", error)
        return { error: "User not found. Please check your email or register." }
      }

      if (!data || data.length === 0) {
        return { error: "User not found. Please check your email or register." }
      }

      const userData = data[0]
      setUser(userData)
      localStorage.setItem("evently_prototype_user", JSON.stringify(userData))
      return {}
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signUp = async (email: string, fullName: string, role: string) => {
    try {
      const trimmedEmail = email.toLowerCase().trim()

      // Use RPC to create user to bypass RLS
      const { data, error } = await supabase.rpc("create_new_user", {
        user_email: trimmedEmail,
        user_name: fullName.trim(),
        user_role: role,
      })

      if (error) {
        console.error("Registration error:", error)
        if (error.message.includes("duplicate") || error.message.includes("already exists")) {
          return { error: "User with this email already exists" }
        }
        return { error: "Failed to create account. Please try again." }
      }

      if (!data || data.length === 0) {
        return { error: "Failed to create account" }
      }

      const userData = data[0]
      setUser(userData)
      localStorage.setItem("evently_prototype_user", JSON.stringify(userData))
      return {}
    } catch (error) {
      console.error("Signup error:", error)
      return { error: "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("evently_prototype_user")
  }

  return (
    <PrototypeAuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </PrototypeAuthContext.Provider>
  )
}

export function usePrototypeAuth() {
  const context = useContext(PrototypeAuthContext)
  if (context === undefined) {
    throw new Error("usePrototypeAuth must be used within a PrototypeAuthProvider")
  }
  return context
}
