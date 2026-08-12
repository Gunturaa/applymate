"use client"
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MapPin, Building2, ExternalLink, BookmarkPlus, Loader2, DollarSign, Clock } from "lucide-react"
import { searchJobs, saveJobToWishlist } from "@/app/actions/jobs"
import { Badge } from "@/components/ui/badge"

export function JobSearchClient({ locale }: { locale: string }) {
  const [titleQuery, setTitleQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("Indonesia")
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)
    const result = await searchJobs(titleQuery, locationQuery || "Indonesia")
    
    if (result.error) {
      alert(result.error)
      setJobs([])
    } else {
      setJobs(result.data || [])
    }
    setIsLoading(false)
  }

  const handleSaveToWishlist = async (job: any) => {
    setSavingId(job.job_id)
    const result = await saveJobToWishlist(job)
    setSavingId(null)
    
    if (result.error) {
      alert(result.error)
    } else {
      alert(locale === "id" ? "Berhasil disimpan ke Kanban!" : "Successfully saved to Kanban!")
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            placeholder={locale === "id" ? "Posisi (Misal: Akuntan, Designer)" : "Role (e.g., Accountant, Designer)"}
            className="pl-10 h-12 text-base"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder={locale === "id" ? "Lokasi (Misal: Jakarta)" : "Location (e.g., Jakarta)"}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-8" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {locale === "id" ? "Cari" : "Search"}
        </Button>
      </form>

      {hasSearched && !isLoading && jobs.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
          {locale === "id" ? "Tidak ada lowongan ditemukan. Coba kata kunci lain." : "No jobs found. Try a different keyword."}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.job_id} className="flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg leading-tight line-clamp-2" title={job.job_title}>
                  {job.job_title}
                </CardTitle>
                {job.employer_logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.employer_logo} alt={job.employer_name} className="w-10 h-10 object-contain rounded-md" />
                )}
              </div>
              <div className="flex items-center text-muted-foreground mt-2">
                <Building2 className="mr-2 h-4 w-4 shrink-0" />
                <span className="text-sm font-medium line-clamp-1">{job.employer_name}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{job.job_city ? `${job.job_city}, ` : ''}{job.job_country}</span>
                </div>
                {(job.job_min_salary || job.job_max_salary) && (
                  <div className="flex items-center text-green-600 dark:text-green-500 font-medium">
                    <DollarSign className="mr-2 h-4 w-4 shrink-0" />
                    <span>
                      {job.job_min_salary ? `${job.job_salary_currency} ${job.job_min_salary}` : ''}
                      {job.job_max_salary ? ` - ${job.job_max_salary}` : ''}
                      {job.job_salary_period ? ` / ${job.job_salary_period.toLowerCase()}` : ''}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 shrink-0" />
                  <span>{job.job_employment_type || 'Full-time'}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Badge variant="secondary" className="font-normal text-xs">
                  {job.job_publisher}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="w-full sm:w-1/2" 
                onClick={() => window.open(job.job_apply_link, '_blank')}
                disabled={!job.job_apply_link}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Apply
              </Button>
              <Button 
                className="w-full sm:w-1/2" 
                onClick={() => handleSaveToWishlist(job)}
                disabled={savingId === job.job_id}
              >
                {savingId === job.job_id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
