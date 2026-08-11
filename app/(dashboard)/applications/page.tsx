import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ApplicationActions } from "@/components/dashboard/application-actions"
import { getLanguage } from "@/lib/i18n/server"

const statusColors: Record<string, string> = {
  Wishlist: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Screening: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Assessment: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Interview: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Offer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const { dictionary } = await getLanguage()

  // Ambil data lamaran dari Supabase beserta nama perusahaan
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .order('created_at', { ascending: false })

  // Pastikan applications berupa array meskipun kosong
  const apps = applications || []

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dictionary.applications.title}</h2>
          <p className="text-muted-foreground">Manage and track all your job applications.</p>
        </div>
        <Link href="/applications/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          {dictionary.applications.newApplication}
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="search" placeholder={dictionary.header.search} className="w-full" />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dictionary.applications.columns.company}</TableHead>
              <TableHead>{dictionary.applications.columns.position}</TableHead>
              <TableHead>{dictionary.applications.columns.status}</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>{dictionary.applications.columns.date}</TableHead>
              <TableHead className="text-right">{dictionary.applications.columns.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {dictionary.dashboard.noApplications}
                </TableCell>
              </TableRow>
            ) : (
              apps.map((app) => {
                const statusStr = capitalizeFirstLetter(app.status)
                const priorityStr = capitalizeFirstLetter(app.priority)
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.companies?.name || 'Unknown'}</TableCell>
                    <TableCell>{app.position}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${statusColors[statusStr] || "bg-gray-100"} border-transparent`}>
                        {statusStr}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${priorityColors[priorityStr] || "bg-gray-100"} border-transparent`}>
                        {priorityStr}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-GB') : "-"}</TableCell>
                    <TableCell className="text-right">
                      <ApplicationActions applicationId={app.id} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
