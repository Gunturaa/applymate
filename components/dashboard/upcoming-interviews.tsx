"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Video, CalendarDays } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"

export function UpcomingInterviews({ interviews = [] }: { interviews?: any[] }) {
  const { dictionary } = useLanguage()
  // Filter only upcoming interviews (scheduled_at > now)
  const upcoming = interviews
    .filter(i => new Date(i.scheduled_at) > new Date())
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 3)

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>{dictionary.dashboard.upcomingInterviews}</CardTitle>
        <CardDescription>Your scheduled interviews</CardDescription>
      </CardHeader>
      <CardContent>
        {upcoming.length > 0 ? (
          <div className="space-y-4">
            {upcoming.map((interview) => {
              const dateObj = new Date(interview.scheduled_at)
              const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              
              const appData = interview.applications as any
              const companyName = appData?.companies?.name || 'Unknown'
              const position = appData?.position || 'Unknown'

              return (
                <div key={interview.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{companyName}</p>
                      <p className="text-sm text-muted-foreground">{position} • {interview.interview_type}</p>
                      <p className="text-xs font-medium text-primary sm:hidden mt-1">{dateStr} at {timeStr}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex sm:mt-0 sm:flex-col sm:items-end gap-2">
                    <p className="hidden sm:block text-sm font-medium">{dateStr}</p>
                    <p className="hidden sm:block text-sm text-muted-foreground">{timeStr}</p>
                    <Link href={interview.meeting_url || '#'} className={buttonVariants({ size: "sm", className: "w-full sm:w-auto" })}>
                      <Video className="mr-2 h-4 w-4" />
                      Join
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center space-y-3 rounded-lg border border-dashed">
            <Video className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{dictionary.dashboard.noInterviews}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
