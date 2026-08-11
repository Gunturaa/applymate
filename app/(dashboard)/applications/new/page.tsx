"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "@/components/ui/toast"

import { createApplication } from "../actions"

export default function NewApplicationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await createApplication(formData)

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      // If toast is available:
      // toast.add({ title: "Error", description: result.error, type: "error" })
    } else if (result.success) {
      router.push('/applications')
    }
  }
  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/applications" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Application</h2>
          <p className="text-muted-foreground">Track a new job application.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card p-6">
        <form className="space-y-8" onSubmit={onSubmit}>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">Company Name *</label>
              <Input id="company" name="company" placeholder="e.g. Google" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">Position *</label>
              <Input id="position" name="position" placeholder="e.g. Frontend Engineer" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Input id="location" name="location" placeholder="e.g. Remote, Jakarta" />
            </div>

            <div className="space-y-2">
              <label htmlFor="employmentType" className="text-sm font-medium">Employment Type</label>
              <Select defaultValue="Full-time" name="employmentType">
                <SelectTrigger id="employmentType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select defaultValue="Applied" name="status">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wishlist">Wishlist</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Screening">Screening</SelectItem>
                  <SelectItem value="Assessment">Assessment</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <Select defaultValue="Medium" name="priority">
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="salary" className="text-sm font-medium">Salary (Optional)</label>
              <Input id="salary" name="salary" placeholder="e.g. Rp 10.000.000 - 15.000.000" />
            </div>

            <div className="space-y-2">
              <label htmlFor="jobUrl" className="text-sm font-medium">Job Posting URL</label>
              <Input id="jobUrl" name="jobUrl" type="url" placeholder="https://..." />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="appliedDate" className="text-sm font-medium">Applied Date</label>
              <Input id="appliedDate" name="appliedDate" type="date" />
            </div>

            <div className="space-y-2">
              <label htmlFor="followUpDate" className="text-sm font-medium">Follow-up Date</label>
              <Input id="followUpDate" name="followUpDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="jobDescription" className="text-sm font-medium">Job Description</label>
            <Textarea id="jobDescription" name="jobDescription" rows={5} placeholder="Paste job description here..." />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Personal Notes</label>
            <Textarea id="notes" name="notes" rows={3} placeholder="Any specific requirements or things to remember?" />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link href="/applications" className={buttonVariants({ variant: "outline" })}>Cancel</Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
