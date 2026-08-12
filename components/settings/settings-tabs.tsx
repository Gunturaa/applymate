"use client"
import React, { useState } from "react"
import { ProfileForm } from "./profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

export function SettingsTabs({ profile }: { profile: any }) {
  const [activeTab, setActiveTab] = useState('profile')
  const { dictionary } = useLanguage()

  const tabs = [
    { id: 'profile', label: dictionary.settings?.profile || 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 border-r md:pr-6 space-y-2 flex md:flex-col overflow-x-auto pb-2 md:pb-0">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="md:col-span-3">
        {activeTab === 'profile' && <ProfileForm profile={profile} />}
        
        {activeTab === 'account' && (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Account management (password reset, email change, deletion) is currently managed by Supabase Auth.</p>
              <Button variant="destructive" disabled>Delete Account</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive daily summaries and interview reminders.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Application Updates</h4>
                  <p className="text-sm text-muted-foreground">Get notified when a job status changes.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Marketing Emails</h4>
                  <p className="text-sm text-muted-foreground">Receive tips and tricks about job hunting.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'appearance' && (
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Localization</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Theme</h4>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
                </div>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Language</h4>
                  <p className="text-sm text-muted-foreground">Change the application language.</p>
                </div>
                <LanguageToggle />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
