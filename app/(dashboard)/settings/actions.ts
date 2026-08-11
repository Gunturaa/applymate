"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const full_name = formData.get("full_name") as string
  const phone = formData.get("phone") as string
  const location = formData.get("location") as string
  const headline = formData.get("headline") as string
  const bio = formData.get("bio") as string
  const linkedin_url = formData.get("linkedin_url") as string
  const github_url = formData.get("github_url") as string
  const portfolio_url = formData.get("portfolio_url") as string

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name,
      phone,
      location,
      headline,
      bio,
      linkedin_url,
      github_url,
      portfolio_url,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating profile:", error)
    return { error: error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/dashboard")
  return { success: true }
}
