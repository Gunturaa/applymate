"use client"
import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, Loader2 } from "lucide-react"
import { uploadResume } from "@/app/(dashboard)/resumes/actions"

export function ResumeUploadArea() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    setError(null)
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.")
      return
    }
    if (selectedFile.size > 5242880) {
      setError("File must be less than 5MB.")
      return
    }
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.")
      return
    }

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("category", category || "General")

    const result = await uploadResume(formData)
    
    setIsUploading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setFile(null)
      setCategory("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Resume</CardTitle>
        <CardDescription>Upload a PDF format of your resume.</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: "pointer" }}
        >
          <UploadCloud className={`h-10 w-10 mb-4 ${file ? 'text-primary' : 'text-muted-foreground'}`} />
          <h3 className="font-medium mb-1">
            {file ? file.name : "Click or drag file to this area to upload"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Support for a single PDF upload. Maximum size 5MB."}
          </p>
          <Button variant="outline" type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
            {file ? "Change File" : "Select File"}
          </Button>
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelection(e.target.files[0])
              }
            }}
          />
        </div>

        <div className="mt-6 space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="resume-type">Resume Category / Label</Label>
            <Input 
              id="resume-type" 
              placeholder="e.g. Frontend Developer" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Upload Resume
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
