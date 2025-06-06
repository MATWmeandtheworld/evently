import { createClient } from "@/lib/supabase/client"

export interface AttendeeProfileData {
  full_name: string
  email: string
  phone: string
  address: string
  date_of_birth: string
  emergency_contact: string
  dietary_preferences: string
  interests: string
}

export interface OrganizerProfileData {
  full_name: string
  email: string
  phone: string
  company_name: string
  company_address: string
  business_license: string
  website: string
  social_media: string
  bio: string
  specialization: string
  years_experience: string
}

export interface AdminProfileData {
  full_name: string
  email: string
  phone: string
  employee_id: string
  department: string
  office_address: string
  emergency_contact: string
}

export class ProfileService {
  private supabase = createClient()

  async updateAttendeeProfile(userId: string, profileData: AttendeeProfileData) {
    try {
      // Update users table
      const { error: userError } = await this.supabase
        .from("users")
        .update({
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (userError) {
        console.error("Error updating user:", userError)
        throw new Error("Failed to update basic profile information")
      }

      // Update or insert attendee profile
      const { error: profileError } = await this.supabase.from("attendee_profiles").upsert({
        user_id: userId,
        address: profileData.address,
        date_of_birth: profileData.date_of_birth || null,
        emergency_contact: profileData.emergency_contact,
        dietary_preferences: profileData.dietary_preferences,
        interests: profileData.interests,
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error updating attendee profile:", profileError)
        throw new Error("Failed to update attendee profile")
      }

      return { success: true }
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }

  async updateOrganizerProfile(userId: string, profileData: OrganizerProfileData) {
    try {
      // Update users table
      const { error: userError } = await this.supabase
        .from("users")
        .update({
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (userError) {
        console.error("Error updating user:", userError)
        throw new Error("Failed to update basic profile information")
      }

      // Update or insert organizer profile
      const { error: profileError } = await this.supabase.from("organizer_profiles").upsert({
        user_id: userId,
        company_name: profileData.company_name,
        company_address: profileData.company_address,
        business_license: profileData.business_license,
        website: profileData.website,
        social_media: profileData.social_media,
        bio: profileData.bio,
        specialization: profileData.specialization,
        years_experience: profileData.years_experience ? Number.parseInt(profileData.years_experience) : null,
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error updating organizer profile:", profileError)
        throw new Error("Failed to update organizer profile")
      }

      return { success: true }
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }

  async updateAdminProfile(userId: string, profileData: AdminProfileData) {
    try {
      // Update users table
      const { error: userError } = await this.supabase
        .from("users")
        .update({
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (userError) {
        console.error("Error updating user:", userError)
        throw new Error("Failed to update basic profile information")
      }

      // Update or insert admin profile
      const { error: profileError } = await this.supabase.from("admin_profiles").upsert({
        user_id: userId,
        employee_id: profileData.employee_id,
        department: profileData.department,
        office_address: profileData.office_address,
        emergency_contact: profileData.emergency_contact,
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Error updating admin profile:", profileError)
        throw new Error("Failed to update admin profile")
      }

      return { success: true }
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }

  async getAttendeeProfile(userId: string) {
    try {
      const { data, error } = await this.supabase.from("attendee_profiles").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching attendee profile:", error)
        throw new Error("Failed to fetch attendee profile")
      }

      return data || {}
    } catch (error) {
      console.error("Profile fetch error:", error)
      return {}
    }
  }

  async getOrganizerProfile(userId: string) {
    try {
      const { data, error } = await this.supabase.from("organizer_profiles").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching organizer profile:", error)
        throw new Error("Failed to fetch organizer profile")
      }

      return data || {}
    } catch (error) {
      console.error("Profile fetch error:", error)
      return {}
    }
  }

  async getAdminProfile(userId: string) {
    try {
      const { data, error } = await this.supabase.from("admin_profiles").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching admin profile:", error)
        throw new Error("Failed to fetch admin profile")
      }

      return data || {}
    } catch (error) {
      console.error("Profile fetch error:", error)
      return {}
    }
  }
}

export const profileService = new ProfileService()
