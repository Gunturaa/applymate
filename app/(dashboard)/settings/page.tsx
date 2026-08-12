import React from "react"
import { createClient } from "@/lib/supabase/server"
import { SettingsTabs } from "@/components/settings/settings-tabs"
import { getLanguage } from "@/lib/i18n/server"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { dictionary, locale } = await getLanguage()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dictionary.settings.title}</h2>
          <p className="text-muted-foreground">{locale === 'id' ? 'Kelola pengaturan dan preferensi akun Anda.' : 'Manage your account settings and preferences.'}</p>
        </div>
      </div>

      <SettingsTabs profile={profile} />
    </div>
  )
}
