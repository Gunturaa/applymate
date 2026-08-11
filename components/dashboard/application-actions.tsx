"use client"

import { Button } from "@/components/ui/button"
import { MoreHorizontal, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deleteApplication } from "@/app/(dashboard)/applications/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return

    setIsDeleting(true)
    const result = await deleteApplication(applicationId)
    setIsDeleting(false)

    if (result.error) {
      alert("Error deleting application: " + result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
        <span className="sr-only">Open menu</span>
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuItem render={<Link href={`/applications/${applicationId}`} />}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/applications/${applicationId}/edit`} />}>
          Edit Application
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete} 
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
