"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"

export async function uploadResume(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const file = formData.get("file") as File
  const category = formData.get("category") as string

  if (!file) return { error: "No file provided" }
  if (file.size > 5242880) return { error: "File must be less than 5MB" }
  if (file.type !== "application/pdf") return { error: "Only PDF files are allowed" }

  // We need to use Supabase admin client to bypass RLS for storage because we haven't set up complex storage RLS policies
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const timestamp = new Date().getTime()
  // Clean filename
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${user.id}/${timestamp}_${cleanName}`

  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('resumes')
    .upload(filePath, file, {
      contentType: 'application/pdf',
      upsert: false
    })

  if (uploadError) {
    console.error("Storage error:", uploadError)
    return { error: "Failed to upload file to storage" }
  }

  // Insert into DB
  const { data: resumeData, error: dbError } = await supabase
    .from('resumes')
    .insert([{
      user_id: user.id,
      name: file.name,
      file_url: filePath,
      target_role: category,
      version: '1.0'
    }])
    .select()
    .single()

  if (dbError) {
    // Attempt to clean up the uploaded file if DB insertion fails
    await supabaseAdmin.storage.from('resumes').remove([filePath])
    console.error("Database error:", dbError)
    return { error: "Failed to save resume details in database" }
  }

  revalidatePath("/resumes")
  return { success: true, resume: resumeData }
}

export async function deleteResume(resumeId: string, filePath: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Admin client to delete from storage bypassing RLS
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Delete from storage
  const { error: storageError } = await supabaseAdmin.storage
    .from('resumes')
    .remove([filePath])

  if (storageError) {
    console.error("Storage delete error:", storageError)
    // We continue to delete from DB even if storage deletion fails, 
    // to keep UI consistent if file was already missing.
  }

  // Delete from DB (RLS ensures user owns the resume)
  const { error: dbError } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId)
    .eq('user_id', user.id)

  if (dbError) {
    console.error("DB delete error:", dbError)
    return { error: "Failed to delete resume from database" }
  }

  revalidatePath("/resumes")
  return { success: true }
}

export async function getResumeDownloadUrl(filePath: string) {
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Create signed URL valid for 60 seconds
  const { data, error } = await supabaseAdmin.storage
    .from('resumes')
    .createSignedUrl(filePath, 60)
    
  if (error) {
    return { error: error.message }
  }
  
  return { url: data.signedUrl }
}
