import React from "react"
import { createClient } from "@/lib/supabase/server"
import { ResumeUploadArea } from "@/components/resumes/resume-upload-area"
import { ResumeList } from "@/components/resumes/resume-list"
import { getLanguage } from "@/lib/i18n/server"

export default async function ResumesPage() {
  const supabase = await createClient()
  const { dictionary, locale } = await getLanguage()

  // Fetch real resumes
  const { data: resumesData } = await supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false })

  const resumes = resumesData || []

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dictionary.resumes.title}</h2>
          <p className="text-muted-foreground">{locale === 'id' ? 'Kelola resume dan CV Anda untuk berbagai lamaran.' : 'Manage your resumes and CVs for different applications.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ResumeUploadArea />
        </div>

        <ResumeList resumes={resumes} />
      </div>
    </div>
  )
}
