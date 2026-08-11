import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EditApplicationForm } from "@/components/dashboard/edit-application-form"

export default async function EditApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: application } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .eq('id', resolvedParams.id)
    .single()

  if (!application) {
    notFound()
  }

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/applications" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Application</h2>
          <p className="text-muted-foreground">Update your job application details.</p>
        </div>
      </div>

      <EditApplicationForm application={application} />
    </div>
  )
}
