"use client"
import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { updateProfile } from "@/app/(dashboard)/settings/actions"

export function ProfileForm({ profile }: { profile: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    setIsLoading(false)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details and public profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <div className={`p-3 text-sm rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={profile?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email is managed by your authentication provider.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" name="headline" placeholder="e.g. Senior Software Engineer" defaultValue={profile?.headline || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" placeholder="+62 812..." defaultValue={profile?.phone || ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g. Jakarta, Indonesia" defaultValue={profile?.location || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={4} placeholder="A short description about you..." defaultValue={profile?.bio || ""} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" name="linkedin_url" placeholder="https://linkedin.com/in/..." defaultValue={profile?.linkedin_url || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" name="github_url" placeholder="https://github.com/..." defaultValue={profile?.github_url || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio / Website</Label>
              <Input id="portfolio_url" name="portfolio_url" placeholder="https://yourdomain.com" defaultValue={profile?.portfolio_url || ""} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
