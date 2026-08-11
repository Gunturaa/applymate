import { StatsCards } from "@/components/dashboard/stats-cards"
import { FunnelChart } from "@/components/dashboard/funnel-chart"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews"
import { createClient } from "@/lib/supabase/server"
import { getLanguage } from "@/lib/i18n/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { dictionary, locale } = await getLanguage()

  // Fetch real applications
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .order('created_at', { ascending: false })
    
  const apps = applications || []

  // Fetch interviews
  const { data: interviewsData } = await supabase
    .from('interviews')
    .select('*, applications(position, companies(name))')
    .order('scheduled_at', { ascending: true })

  const interviews = interviewsData || []

  // Compute stats dynamically
  const stats = {
    total: apps.length,
    active: apps.filter(a => ['screening', 'assessment', 'interview'].includes(a.status?.toLowerCase())).length,
    interviews: apps.filter(a => a.status?.toLowerCase() === 'interview').length,
    offers: apps.filter(a => a.status?.toLowerCase() === 'offer').length,
    hired: apps.filter(a => a.status?.toLowerCase() === 'hired').length
  }

  // Get user profile name
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('user_id', user?.id)
    .single()
    
  const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : 'User'

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{locale === "id" ? `Selamat pagi, ${firstName} 👋` : `Good morning, ${firstName} 👋`}</h2>
      </div>
      <p className="text-muted-foreground">
        {locale === "id" ? "Berikut perkembangan pencarian kerja Anda." : "Here's your job search progress."}
      </p>

      <div className="space-y-4">
        <StatsCards stats={stats} />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RecentApplications applications={apps} />
          <UpcomingInterviews interviews={interviews || []} />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <FunnelChart applications={apps} />
          </div>
        </div>
      </div>
    </div>
  )
}

