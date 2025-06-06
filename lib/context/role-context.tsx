"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type UserRole = "admin" | "organizer" | "attendee" | null

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  clearRole: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null)

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem("evently_user_role")
    if (savedRole && ["admin", "organizer", "attendee"].includes(savedRole)) {
      setRoleState(savedRole as UserRole)
    }
  }, [])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    if (newRole) {
      localStorage.setItem("evently_user_role", newRole)
    } else {
      localStorage.removeItem("evently_user_role")
    }
  }

  const clearRole = () => {
    setRoleState(null)
    localStorage.removeItem("evently_user_role")
  }

  return <RoleContext.Provider value={{ role, setRole, clearRole }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
