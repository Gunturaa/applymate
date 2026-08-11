import React from "react"
import { createClient } from "@/lib/supabase/server"
import { KanbanClient } from "./kanban-client"
import { getLanguage } from "@/lib/i18n/server"

export default async function KanbanPage() {
  const supabase = await createClient()
  const { dictionary, locale } = await getLanguage()

  // Ambil data lamaran dari Supabase
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .order('created_at', { ascending: false })

  const apps = applications || []

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{dictionary.kanban.title}</h2>
        <p className="text-muted-foreground">{locale === 'id' ? 'Geser dan letakkan lamaran Anda untuk mengubah statusnya.' : 'Drag and drop your applications to update their status.'}</p>
      </div>

      <KanbanClient initialData={apps} />
    </div>
  )
}
