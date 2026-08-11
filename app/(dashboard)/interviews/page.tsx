import React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Calendar as CalendarIcon, MapPin, Clock, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LogInterviewDialog } from "@/components/interviews/log-interview-dialog"
import { getLanguage } from "@/lib/i18n/server"

export default async function InterviewsPage() {
  const supabase = await createClient()
  const { dictionary, locale } = await getLanguage()

  // Fetch all applications to pass to the dialog
  const { data: applications } = await supabase
    .from('applications')
    .select('id, position, companies(name)')
    .order('created_at', { ascending: false })

  // Fetch interviews
  const { data: interviewsData } = await supabase
    .from('interviews')
    .select(`
      *,
      applications (
        id,
        position,
        companies (name)
      )
    `)
    .order('scheduled_at', { ascending: true })

  const interviews = interviewsData || []

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dictionary.interviews.title}</h2>
          <p className="text-muted-foreground">{locale === 'id' ? 'Kelola wawancara yang akan datang dan yang sudah lewat.' : 'Manage your upcoming and past interviews.'}</p>
        </div>
        <LogInterviewDialog applications={applications || []} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {interviews.length === 0 ? (
          <div className="text-center p-12 border rounded-md bg-card text-muted-foreground">
            {dictionary.dashboard.noInterviews}
          </div>
        ) : (
          interviews.map(interview => {
            const isCompleted = new Date(interview.scheduled_at) < new Date()
            const appData = interview.applications as any
            const companyName = appData?.companies?.name || 'Unknown Company'
            const position = appData?.position || 'Unknown Position'
            
            // Format date and time
            const dateObj = new Date(interview.scheduled_at)
            const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

            // Extract round from interviewer_role if we stored it as "Round - Role"
            const roleStr = interview.interviewer_role || ''
            const hasRound = roleStr.includes(' - ')
            const round = hasRound ? roleStr.split(' - ')[0] : 'Interview'
            const role = hasRound ? roleStr.split(' - ')[1] : roleStr

            return (
              <Card key={interview.id} className={isCompleted ? 'opacity-70 bg-slate-50 dark:bg-slate-900/20' : ''}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 border-b md:border-b-0 md:border-r p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-center">
                    <Badge className={`w-fit mb-4 ${!isCompleted ? 'bg-primary' : 'bg-slate-500'}`}>
                      {!isCompleted ? 'Upcoming' : 'Completed'}
                    </Badge>
                    <div className="flex items-center text-lg font-bold text-primary mb-2">
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {dateStr}
                    </div>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <Clock className="mr-2 h-4 w-4" />
                      {timeStr}
                    </div>
                    {interview.interview_type === 'Video Call' ? (
                      <Link href={interview.meeting_url || '#'} target="_blank" className={buttonVariants({ variant: !isCompleted ? 'default' : 'outline', className: "w-full" })}>
                        <Video className="mr-2 h-4 w-4" />
                        Join Video Call
                      </Link>
                    ) : (
                      <div className="flex items-start text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4 shrink-0 mt-0.5" />
                        <span className="break-all">{interview.meeting_url || 'No location provided'}</span>
                      </div>
                    )}
                  </div>
                  <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{position}</h3>
                          <p className="text-lg text-muted-foreground">{companyName}</p>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                          {round}
                        </Badge>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground block mb-1">Interviewer</span>
                          <span className="text-sm font-semibold">{interview.interviewer_name || 'Not specified'} {role ? `(${role})` : ''}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground block mb-1">Type</span>
                          <span className="text-sm font-semibold">{interview.interview_type}</span>
                        </div>
                      </div>

                      {interview.notes && (
                        <div className="mt-6">
                          <span className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                            <FileText className="mr-2 h-4 w-4" />
                            Preparation Notes
                          </span>
                          <p className="text-sm bg-muted/50 p-3 rounded-md border">{interview.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-2">
                      <Button variant="outline" size="sm" render={<Link href={`/applications/${interview.application_id}`} />}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Application
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
