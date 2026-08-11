"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Loader2 } from "lucide-react"
import { createInterview } from "@/app/(dashboard)/interviews/actions"

export function LogInterviewDialog({ applications }: { applications: any[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await createInterview(formData)

    setIsLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        Log Interview
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log an Interview</DialogTitle>
          <DialogDescription>
            Record an upcoming or past interview for your job applications.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-6 mt-4">
          {error && <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="applicationId" className="text-sm font-medium">Application *</label>
              <Select name="applicationId" required>
                <SelectTrigger id="applicationId">
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map(app => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.companies?.name} - {app.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Interview Type *</label>
              <Select name="type" required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="e.g. Video Call" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video Call">Video Call</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Take-home Assessment">Take-home Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="round" className="text-sm font-medium">Interview Round</label>
              <Input id="round" name="round" placeholder="e.g. HR Screening, Technical" />
            </div>

            <div className="space-y-2">
              <label htmlFor="scheduledAt" className="text-sm font-medium">Date & Time *</label>
              <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
              <Input id="duration" name="duration" type="number" defaultValue={60} />
            </div>

            <div className="space-y-2">
              <label htmlFor="meetingUrl" className="text-sm font-medium">Meeting URL / Location</label>
              <Input id="meetingUrl" name="meetingUrl" placeholder="https://meet.google.com/..." />
            </div>

            <div className="space-y-2">
              <label htmlFor="interviewerName" className="text-sm font-medium">Interviewer Name</label>
              <Input id="interviewerName" name="interviewerName" placeholder="e.g. John Doe" />
            </div>

            <div className="space-y-2">
              <label htmlFor="interviewerRole" className="text-sm font-medium">Interviewer Role</label>
              <Input id="interviewerRole" name="interviewerRole" placeholder="e.g. Engineering Manager" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Preparation Notes</label>
            <Textarea id="notes" name="notes" placeholder="What should you prepare for this interview?" rows={3} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Interview
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
