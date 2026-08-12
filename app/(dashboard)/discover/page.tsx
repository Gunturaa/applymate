import React from "react"
import { JobSearchClient } from "@/components/jobs/job-search-client"
import { getLanguage } from "@/lib/i18n/server"

export default async function DiscoverJobsPage() {
  const { locale } = await getLanguage()

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {locale === "id" ? "Temukan Loker" : "Discover Jobs"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "id" 
            ? "Cari jutaan lowongan kerja dari seluruh internet dan simpan langsung ke Kanban Anda." 
            : "Search millions of jobs across the web and save them directly to your Kanban board."}
        </p>
      </div>

      <JobSearchClient locale={locale} />
    </div>
  )
}
