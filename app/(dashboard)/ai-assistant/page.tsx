import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"

export default async function AIAssistantHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Unauthorized</div>
  }

  // Ambil lamaran terbaru
  const { data: applications } = await supabase
    .from('applications')
    .select('id, position, companies(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const apps = applications || []

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          AI Assistant Hub
        </h2>
        <p className="text-muted-foreground">
          Select an application below to get AI-powered interview preparation and resume analysis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {apps.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-semibold text-lg">No applications found</p>
                <p className="text-muted-foreground mt-1">
                  You need to create a job application first before using the AI Assistant.
                </p>
              </div>
              <Link href="/applications/new" className={buttonVariants({ className: "mt-4" })}>
                Create Application
              </Link>
            </CardContent>
          </Card>
        ) : (
          apps.map(app => (
            <Card key={app.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{app.position}</CardTitle>
                <CardDescription>{(app.companies as any)?.name || 'Unknown Company'}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/applications/${app.id}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  <Bot className="mr-2 h-4 w-4" />
                  Open AI Assistant
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
