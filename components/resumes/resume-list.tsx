"use client"
import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, MoreVertical, Search, Download, Trash2, Eye, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { deleteResume, getResumeDownloadUrl } from "@/app/(dashboard)/resumes/actions"

export function ResumeList({ resumes }: { resumes: any[] }) {
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredResumes = resumes.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.target_role && r.target_role.toLowerCase().includes(search.toLowerCase()))
  )

  const handleDownload = async (filePath: string) => {
    const result = await getResumeDownloadUrl(filePath)
    if (result.error) {
      alert("Failed to get download link: " + result.error)
    } else if (result.url) {
      window.open(result.url, '_blank')
    }
  }

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm("Are you sure you want to delete this resume? This cannot be undone.")) return
    
    setDeletingId(id)
    const result = await deleteResume(id, filePath)
    setDeletingId(null)
    
    if (result.error) {
      alert("Error deleting resume: " + result.error)
    }
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Your Files</h3>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resumes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResumes.length === 0 ? (
          <div className="col-span-1 md:col-span-2 flex h-[200px] flex-col items-center justify-center space-y-3 rounded-lg border border-dashed">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No resumes found.</p>
          </div>
        ) : (
          filteredResumes.map(resume => {
            const dateStr = new Date(resume.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            const isDeleting = deletingId === resume.id

            return (
              <Card key={resume.id} className={`relative overflow-hidden group ${isDeleting ? 'opacity-50' : ''}`}>
                <CardContent className="p-0">
                  <div className="p-4 flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate pr-6" title={resume.name}>{resume.name}</h4>
                        {resume.is_default && (
                          <Badge variant="secondary" className="absolute top-4 right-4 bg-primary/10 text-primary border-primary/20 pointer-events-none">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{resume.target_role || 'General'}</p>
                      <div className="flex items-center text-xs text-muted-foreground gap-3">
                        <span>PDF</span>
                        <span>•</span>
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-t md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => handleDownload(resume.file_url)}>
                        <Eye className="mr-2 h-3 w-3" /> View
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => handleDownload(resume.file_url)}>
                        <Download className="mr-2 h-3 w-3" /> Download
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting} />}>
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                        <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => handleDownload(resume.file_url)}>
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => handleDelete(resume.id, resume.file_url)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
