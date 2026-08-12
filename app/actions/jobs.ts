"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY

export async function searchJobs(title: string, location: string = "Indonesia") {
  if (!RAPIDAPI_KEY) {
    return { error: "API key is not configured." }
  }

  if (!title) {
    return { data: [] }
  }

  try {
    // LinkedIn API endpoint
    const url = `https://linkedin-job-search-api.p.rapidapi.com/active-jb?time_frame=24h&limit=15&offset=0&description_format=text&title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      // Cache for 1 hour to avoid hitting API limits during testing
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error("LinkedIn API error:", response.status, response.statusText)
      return { error: "Failed to fetch jobs from LinkedIn API." }
    }

    const data = await response.json()
    
    // The data is an array of jobs directly
    const rawJobs = Array.isArray(data) ? data : []
    
    // Map LinkedIn JSON structure to JSearch structure so UI doesn't break
    const mappedJobs = rawJobs.map((job: any) => ({
      job_id: job.id?.toString() || job.linkedin_id?.toString() || Math.random().toString(),
      job_title: job.title,
      employer_name: job.organization,
      employer_website: job.org_linkedin_website || null,
      employer_logo: job.organization_logo || null,
      job_city: job.cities_derived?.[0] || null,
      job_country: job.countries_derived?.[0] || 'Indonesia',
      job_apply_link: job.url,
      job_publisher: job.source_domain || job.source || 'LinkedIn',
      job_employment_type: job.employment_type || job.ai_employment_type?.[0] || 'Full-time',
      job_min_salary: job.ai_salary_min_value || job.salary || null,
      job_max_salary: job.ai_salary_max_value || null,
      job_salary_currency: job.ai_salary_currency || 'IDR',
      job_salary_period: job.ai_salary_unit_text || 'MONTH',
      job_description: job.description_text || job.ai_core_responsibilities || null
    }))

    return { data: mappedJobs }
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return { error: "An unexpected error occurred." }
  }
}

export async function saveJobToWishlist(jobData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "Unauthorized" }

  // Check if company exists, if not create it
  let companyId = null
  if (jobData.employer_name) {
    // Attempt to find company
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .ilike('name', jobData.employer_name)
      .single()

    if (existingCompany) {
      companyId = existingCompany.id
    } else {
      // Create company
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert([{ 
          name: jobData.employer_name,
          website_url: jobData.employer_website || null
        }])
        .select()
        .single()
        
      if (!companyError && newCompany) {
        companyId = newCompany.id
      }
    }
  }

  // Insert application
  const { data: newApp, error: appError } = await supabase
    .from('applications')
    .insert([{
      user_id: user.id,
      company_id: companyId,
      position: jobData.job_title,
      status: 'wishlist',
      location: `${jobData.job_city || ''} ${jobData.job_country || ''}`.trim() || null,
      salary_min: jobData.job_min_salary || null,
      salary_max: jobData.job_max_salary || null,
      salary_currency: jobData.job_salary_currency || null,
      job_description: jobData.job_description || null,
      job_url: jobData.job_apply_link || null
    }])
    .select()
    .single()

  if (appError) {
    console.error("Error saving job:", appError)
    return { error: "Failed to save job to wishlist." }
  }

  revalidatePath('/applications')
  revalidatePath('/kanban')
  revalidatePath('/wishlist')
  
  return { success: true, application: newApp }
}
