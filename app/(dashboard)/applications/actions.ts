"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createApplication(formData: FormData) {
  const supabase = await createClient()

  // Dapatkan user saat ini
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "You must be logged in to create an application." }
  }

  // Parse form data
  const company_name = formData.get("company") as string
  const position_title = formData.get("position") as string
  const location = formData.get("location") as string
  const employment_type = formData.get("employmentType") as string
  const status = (formData.get("status") as string).toLowerCase()
  const priority = (formData.get("priority") as string).toLowerCase()
  const salary_range = formData.get("salary") as string
  const job_url = formData.get("jobUrl") as string
  const applied_date = formData.get("appliedDate") as string || null
  const job_description = formData.get("jobDescription") as string
  const notes = formData.get("notes") as string

  if (!company_name || !position_title) {
    return { error: "Company name and position are required." }
  }

  // 1. Dapatkan atau Buat Perusahaan (Company)
  let company_id = null
  if (company_name) {
    const { data: comp } = await supabase
      .from('companies')
      .select('id')
      .eq('name', company_name)
      .eq('user_id', user.id)
      .single()
      
    if (comp) {
      company_id = comp.id
    } else {
      const { data: newComp, error: compErr } = await supabase
        .from('companies')
        .insert([{ name: company_name, user_id: user.id }])
        .select('id')
        .single()
        
      if (newComp) company_id = newComp.id
    }
  }

  // 2. Insert ke tabel applications
  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        user_id: user.id,
        company_id,
        position: position_title,
        location,
        employment_type,
        status,
        priority,
        job_url,
        applied_at: applied_date ? new Date(applied_date).toISOString() : null,
        job_description,
        notes: notes + (salary_range ? `\nSalary: ${salary_range}` : ""),
      }
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating application:", error)
    return { error: error.message }
  }

  revalidatePath("/applications")
  revalidatePath("/dashboard")
  revalidatePath("/kanban")
  
  return { success: true, application: data }
}

export async function updateApplicationStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("applications")
    .update({ status: status.toLowerCase(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating status:", error)
    return { error: error.message }
  }

  revalidatePath("/applications")
  revalidatePath("/kanban")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteApplication(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting application:", error)
    return { error: error.message }
  }

  revalidatePath("/applications")
  revalidatePath("/kanban")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateApplication(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to update an application." }
  }

  const company_name = formData.get("company") as string
  const position = formData.get("position") as string
  const location = formData.get("location") as string
  const employment_type = formData.get("employmentType") as string
  const status = (formData.get("status") as string).toLowerCase()
  const priority = (formData.get("priority") as string).toLowerCase()
  const salary = formData.get("salary") as string
  const job_url = formData.get("jobUrl") as string
  const applied_date = formData.get("appliedDate") as string || null
  const job_description = formData.get("jobDescription") as string
  const notes = formData.get("notes") as string

  if (!company_name || !position) {
    return { error: "Company name and position are required." }
  }

  let company_id = null
  if (company_name) {
    const { data: comp } = await supabase
      .from('companies')
      .select('id')
      .eq('name', company_name)
      .eq('user_id', user.id)
      .single()
      
    if (comp) {
      company_id = comp.id
    } else {
      const { data: newComp } = await supabase
        .from('companies')
        .insert([{ name: company_name, user_id: user.id }])
        .select('id')
        .single()
        
      if (newComp) company_id = newComp.id
    }
  }

  // Handle salary to extract or just append to notes
  let finalNotes = notes
  if (salary && !notes.includes(`Salary: ${salary}`)) {
    finalNotes = notes ? `${notes}\nSalary: ${salary}` : `Salary: ${salary}`
  }

  const { error } = await supabase
    .from("applications")
    .update({
      company_id,
      position,
      location,
      employment_type,
      status,
      priority,
      job_url,
      applied_at: applied_date ? new Date(applied_date).toISOString() : null,
      job_description,
      notes: finalNotes,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating application:", error)
    return { error: error.message }
  }

  revalidatePath("/applications")
  revalidatePath(`/applications/${id}`)
  revalidatePath("/kanban")
  revalidatePath("/dashboard")
  
  return { success: true }
}
