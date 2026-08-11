import React from "react"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/settings/profile-form"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 border-r pr-6 space-y-2">
          {/* Navigation for settings if we had more sections */}
          <div className="bg-primary/10 text-primary font-medium px-4 py-2 rounded-md">
            {dictionary.settings.profile}
          </div>
          <div className="text-muted-foreground hover:bg-muted px-4 py-2 rounded-md cursor-pointer">
            Account
          </div>
          <div className="text-muted-foreground hover:bg-muted px-4 py-2 rounded-md cursor-pointer">
            Notifications
          </div>
          <div className="text-muted-foreground hover:bg-muted px-4 py-2 rounded-md cursor-pointer">
            Appearance
          </div>
        </div>
        <div className="md:col-span-3">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}
