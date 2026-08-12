"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
import { GoogleGenAI } from "@google/genai"
import { cookies } from "next/headers"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

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

export async function generateGeneralResumeFeedback(resumeId: string, filePath: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const cookieStore = await cookies()
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en"
  const langInstruction = locale === "id" ? "PENTING: Jawablah SEMUA dalam Bahasa Indonesia." : "IMPORTANT: Please reply entirely in English."

  try {
    // 1. Get signed URL for the PDF
    const { url, error: urlError } = await getResumeDownloadUrl(filePath)
    if (urlError || !url) return { error: "Failed to access resume file." }

    // 2. Fetch PDF content as buffer
    const res = await fetch(url)
    if (!res.ok) {
       return { error: "Failed to download the resume file." }
    }
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')

    // 3. Prompt Gemini
    const prompt = `You are an expert tech recruiter and ATS (Applicant Tracking System) specialist.
I have attached my resume as a PDF. Please analyze my resume generally (without a specific job description) and provide a comprehensive review:

1. **Estimated ATS Score**: Give a rough score out of 100 based on standard ATS readability and formatting.
2. **Strengths**: What are the strongest points of this resume?
3. **Weaknesses & Missing Info**: What standard resume sections or details are missing or poorly explained?
4. **Formatting & Structure Feedback**: Is the layout clean, professional, and easy to parse?
5. **Actionable Suggestions**: Top 3 specific tips to improve this resume for tech roles.

Format the response beautifully using Markdown. 
Use clear headings, bullet points, and bold text for emphasis.
${langInstruction}`

    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: [
            { inlineData: { mimeType: 'application/pdf', data: base64Data } },
            prompt
        ]
    })
    
    return { success: true, text: response.text }
  } catch (e: any) {
    console.error("Gemini API Error:", e)
    return { error: "Failed to generate resume feedback. Ensure your resume is a valid PDF." }
  }
}
