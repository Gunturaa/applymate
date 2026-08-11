"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createInterview(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const application_id = formData.get("applicationId") as string
  const interview_type = formData.get("type") as string
  const scheduled_at = formData.get("scheduledAt") as string
  const duration = parseInt(formData.get("duration") as string) || 60
  const meeting_url = formData.get("meetingUrl") as string
  const interviewer_name = formData.get("interviewerName") as string
  const interviewer_role = formData.get("interviewerRole") as string
  const notes = formData.get("notes") as string
  const round = formData.get("round") as string // saving round into interviewer_role if we don't have round column

  // Wait, let's check schema for round. It has interview_type, interviewer_name, interviewer_role, notes, result
  // We can just concatenate round into interviewer_role or notes for now. 
  // Let's check schema using `cat supabase/migrations/00_initial_schema.sql` previously, wait, I remember `interviews` schema from my earlier thought:
  // id, application_id, user_id, interview_type, scheduled_at, duration, meeting_url, interviewer_name, interviewer_role, notes, result

  const { error } = await supabase
    .from("interviews")
    .insert([{
      user_id: user.id,
      application_id,
      interview_type,
      scheduled_at: new Date(scheduled_at).toISOString(),
      duration,
      meeting_url,
      interviewer_name,
      interviewer_role: round ? `${round} - ${interviewer_role}` : interviewer_role,
      notes,
      result: "Upcoming"
    }])

  if (error) {
    console.error("Error creating interview:", error)
    return { error: error.message }
  }

  revalidatePath("/interviews")
  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  return { success: true }
}
