import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { format, subMonths, isSameMonth } from "date-fns"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { getLanguage } from "@/lib/i18n/server"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { dictionary } = await getLanguage()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in</div>
  }

  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)

  const apps = applications || []
  
  // Exclude wishlist for analytics
  const activeApps = apps.filter(a => a.status?.toLowerCase() !== 'wishlist')
  const totalApplications = activeApps.length

  // Metrics
  const interviewedApps = activeApps.filter(a => ['interview', 'offer'].includes(a.status?.toLowerCase()))
  const interviewRate = totalApplications > 0 ? ((interviewedApps.length / totalApplications) * 100).toFixed(1) : "0.0"

  const offeredApps = activeApps.filter(a => a.status?.toLowerCase() === 'offer')
  const offerRate = totalApplications > 0 ? ((offeredApps.length / totalApplications) * 100).toFixed(1) : "0.0"

  const activeProcesses = activeApps.filter(a => ['screening', 'assessment', 'interview'].includes(a.status?.toLowerCase())).length

  // Application Trends (last 6 months)
  const applicationTrends = []
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(new Date(), i)
    const monthName = format(d, 'MMM')
    
    const count = activeApps.filter(a => {
      const date = new Date(a.applied_at || a.created_at)
      return isSameMonth(date, d)
    }).length
    
    applicationTrends.push({ month: monthName, applications: count })
  }

  // Status Distribution
  const statusDistribution: {name: string, value: number}[] = []
  const statuses = ['applied', 'screening', 'assessment', 'interview', 'offer', 'rejected']
  statuses.forEach(status => {
    const count = activeApps.filter(a => a.status?.toLowerCase() === status).length
    if (count > 0) {
      statusDistribution.push({
        name: dictionary.applications.status[status as keyof typeof dictionary.applications.status] || (status.charAt(0).toUpperCase() + status.slice(1)),
        value: count
      })
    }
  })

  // Top Sources
  const sourceCounts: Record<string, number> = {}
  activeApps.forEach(a => {
    if (a.job_url) {
      try {
        const url = new URL(a.job_url)
        let hostname = url.hostname.replace('www.', '')
        
        if (hostname.includes('linkedin')) hostname = 'LinkedIn'
        else if (hostname.includes('indeed')) hostname = 'Indeed'
        else if (hostname.includes('glassdoor')) hostname = 'Glassdoor'
        else if (hostname.includes('greenhouse')) hostname = 'Greenhouse'
        else if (hostname.includes('lever')) hostname = 'Lever'
        else if (hostname.includes('workday')) hostname = 'Workday'
        else if (hostname.includes('ashby')) hostname = 'Ashby'
        else if (hostname.includes('ycombinator')) hostname = 'Y Combinator'
        else if (hostname.includes('wellfound')) hostname = 'Wellfound'
        else if (hostname.includes('angel.co')) hostname = 'Wellfound'
        else {
          hostname = hostname.split('.')[0]
          hostname = hostname.charAt(0).toUpperCase() + hostname.slice(1)
        }
        
        sourceCounts[hostname] = (sourceCounts[hostname] || 0) + 1
      } catch (e) {
        // Invalid URL
      }
    }
  })

  const sourceData = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dictionary.analytics.title}</h2>
          <p className="text-muted-foreground">Gain insights into your job search performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{dictionary.dashboard.stats.totalApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">Sent applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{dictionary.analytics.conversionRate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Reached interview stage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offer Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Resulted in offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{dictionary.dashboard.stats.activeProcesses}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProcesses}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently interviewing or screening</p>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts 
        applicationTrends={applicationTrends}
        statusDistribution={statusDistribution}
        sourceData={sourceData}
      />
    </div>
  )
}
