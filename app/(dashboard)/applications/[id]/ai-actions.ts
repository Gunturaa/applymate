"use server"

import { createClient } from "@/lib/supabase/server"
import { GoogleGenAI } from "@google/genai"
import { cookies } from "next/headers"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function generateInterviewPrep(applicationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: application, error } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .eq('id', applicationId)
    .eq('user_id', user.id)
    .single()

  if (error || !application) return { error: "Application not found" }

  const cookieStore = await cookies()
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en"
  const langInstruction = locale === "id" ? "PENTING: Jawablah SEMUA dalam Bahasa Indonesia." : "IMPORTANT: Please reply entirely in English."

  const prompt = `You are an expert tech recruiter and interviewer.
I am applying for the position of **${application.position}** at **${application.companies?.name || 'a company'}**.
Here is the job description:
${application.job_description || 'No description provided.'}

Based on this, please provide:
1. 3 Technical Questions that are highly relevant to this role, along with short pointers on how to answer them.
2. 3 Behavioral Questions tailored to this role and company (if known).
3. 2 General Tips for the interview.

Format the response using Markdown.
${langInstruction}`

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
    })
    
    return { success: true, text: response.text }
  } catch (e: any) {
    console.error("Gemini API Error:", e)
    return { error: "Failed to generate interview preparation." }
  }
}

export async function generateResumeFeedback(applicationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // 1. Get Application Details
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .eq('id', applicationId)
    .eq('user_id', user.id)
    .single()

  if (appError || !application) return { error: "Application not found" }

  // 2. Get User's default resume
  const { data: resume, error: resumeError } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_default', true)
    .single()

  let targetResume = resume

  if (resumeError || !resume) {
      // try to get any resume if no default
      const { data: anyResume } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        
      if (!anyResume) {
          return { error: "No resume found. Please upload a resume first." }
      }
      targetResume = anyResume
  }
  
  const cookieStore = await cookies()
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en"
  const langInstruction = locale === "id" ? "PENTING: Jawablah SEMUA dalam Bahasa Indonesia." : "IMPORTANT: Please reply entirely in English."

  // 3. Fetch PDF from Supabase Storage
  try {
    const res = await fetch(targetResume.file_url)
    if (!res.ok) {
       return { error: "Failed to download the resume file from storage." }
    }
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')

    const prompt = `You are an expert tech recruiter.
I am applying for the position of **${application.position}** at **${application.companies?.name || 'a company'}**.
Here is the job description:
${application.job_description || 'No description provided.'}

I have attached my resume as a PDF. Please analyze my resume against the job description and provide:
1. **Strengths**: What makes me a strong candidate for this role based on my resume?
2. **Weaknesses/Gaps**: What is missing from my resume that is required or preferred in the job description?
3. **Suggestions for Improvement**: How can I improve my resume for this specific application?

Format the response using Markdown.
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
