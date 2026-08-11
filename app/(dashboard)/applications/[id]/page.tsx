import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, DollarSign, Briefcase, Link as LinkIcon, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AIAssistantCard } from "@/components/applications/ai-assistant-card"

export default async function ApplicationDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Unauthorized</div>
  }

  const { data: app, error } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !app) {
    notFound()
  }

  const companyName = app.companies?.name || 'Unknown Company'
  const appliedDate = app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-GB') : "Not specified"

  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/applications" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{app.position}</h2>
          <p className="text-lg text-muted-foreground">{companyName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/applications/${app.id}/edit`} className={buttonVariants({ variant: "outline" })}>Edit</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{app.location || "No location specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{app.employment_type || "No employment type specified"}</span>
              </div>
              {app.job_url && (
                <div className="flex items-center gap-2 text-sm sm:col-span-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={app.job_url} className="text-primary hover:underline truncate block w-full" target="_blank" rel="noreferrer">
                    {app.job_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.job_description || "No job description provided."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Notes & Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.notes || "No notes."}</p>
            </CardContent>
          </Card>
          
          {/* AI Assistant Section */}
          <AIAssistantCard applicationId={app.id} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent capitalize">{app.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Priority</span>
                <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-transparent capitalize">{app.priority || "Medium"}</Badge>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-sm font-medium text-muted-foreground">Applied</span>
                <span className="text-sm">{appliedDate}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
