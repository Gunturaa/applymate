"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"

const recentApps = [
  { id: 1, company: "PT Telkom Indonesia", position: "Frontend Developer", status: "Interview", applied: "2024-08-01", nextAction: "Tech Interview" },
  { id: 2, company: "Google", position: "Software Engineer", status: "Assessment", applied: "2024-08-05", nextAction: "Complete Test" },
  { id: 3, company: "PT XYZ Technology", position: "UI/UX Designer", status: "Applied", applied: "2024-08-08", nextAction: "Follow Up" },
]

const statusColors: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Screening: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Assessment: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Interview: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Offer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Hired: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
}

export function RecentApplications({ applications = [] }: { applications?: any[] }) {
  const { dictionary } = useLanguage()
  // Take only the top 5 most recent
  const recentApps = applications.slice(0, 5)

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>{dictionary.dashboard.recentApplications}</CardTitle>
        <CardDescription>Your latest job applications and their current status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentApps.length === 0 ? (
            <div className="text-sm text-muted-foreground">{dictionary.dashboard.noApplications}</div>
          ) : (
            recentApps.map((app) => {
              const statusStr = app.status ? (app.status.charAt(0).toUpperCase() + app.status.slice(1)) : 'Wishlist'
              return (
                <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm">{app.companies?.name || 'Unknown Company'}</span>
                    <span className="text-sm text-muted-foreground">{app.position}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className={`${statusColors[statusStr] || "bg-gray-100"} border-transparent`}>
                      {statusStr}
                    </Badge>
                    <div className="hidden text-sm text-muted-foreground md:block">
                      Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-GB') : '-'}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
