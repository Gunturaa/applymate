import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ApplicationActions } from "@/components/dashboard/application-actions"
import { getLanguage } from "@/lib/i18n/server"

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default async function WishlistPage() {
  const supabase = await createClient()
  const { dictionary, locale } = await getLanguage()

  // Fetch only wishlist applications
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .eq('status', 'wishlist')
    .order('created_at', { ascending: false })

  const apps = applications || []

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dictionary.sidebar.wishlist}</h2>
          <p className="text-muted-foreground">{locale === 'id' ? 'Pekerjaan yang Anda minati tetapi belum dilamar.' : 'Jobs you are interested in but haven\'t applied to yet.'}</p>
        </div>
        <Link href="/applications/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          {dictionary.wishlist.addJob}
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="search" placeholder="Search wishlist..." className="w-full" />
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
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                const priorityStr = capitalizeFirstLetter(app.priority || 'medium')
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.companies?.name || 'Unknown'}</TableCell>
                    <TableCell>{app.position}</TableCell>
                    <TableCell>{app.location || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${priorityColors[priorityStr] || "bg-gray-100"} border-transparent`}>
                        {priorityStr}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB') : "-"}</TableCell>
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
