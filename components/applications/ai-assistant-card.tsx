"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateInterviewPrep, generateResumeFeedback } from "@/app/(dashboard)/applications/[id]/ai-actions"
import { Bot, FileText, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "@/components/ui/toast"

interface AIAssistantCardProps {
  applicationId: string
}

export function AIAssistantCard({ applicationId }: AIAssistantCardProps) {
  const { dictionary } = useLanguage()
  const [activeTab, setActiveTab] = useState("interview")
  const [isLoading, setIsLoading] = useState(false)
  const [interviewPrep, setInterviewPrep] = useState<string | null>(null)
  const [resumeFeedback, setResumeFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateInterview = async () => {
    setIsLoading(true)
    setError(null)
    
    const res = await generateInterviewPrep(applicationId)
    
    if (res.error) {
      setError(res.error)
      toast.add({
        type: "error",
        title: "Error",
        description: res.error,
      })
    } else if (res.success && res.text) {
      setInterviewPrep(res.text)
      toast.add({
        type: "success",
        title: "Success",
        description: "Interview preparation generated successfully!",
      })
    }
    
    setIsLoading(false)
  }

  const handleGenerateResumeFeedback = async () => {
    setIsLoading(true)
    setError(null)
    
    const res = await generateResumeFeedback(applicationId)
    
    if (res.error) {
      setError(res.error)
      toast.add({
        type: "error",
        title: "Error",
        description: res.error,
      })
    } else if (res.success && res.text) {
      setResumeFeedback(res.text)
      toast.add({
        type: "success",
        title: "Success",
        description: "Resume feedback generated successfully!",
      })
    }
    
    setIsLoading(false)
  }

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5 rounded-t-xl border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <CardTitle>{dictionary.aiAssistant.title}</CardTitle>
        </div>
        <CardDescription>
          {dictionary.aiAssistant.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="interview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              {dictionary.aiAssistant.tabInterview}
            </TabsTrigger>
            <TabsTrigger 
              value="resume" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              {dictionary.aiAssistant.tabResume}
            </TabsTrigger>
          </TabsList>
          
          {/* Interview Prep Tab */}
          <TabsContent value="interview" className="p-6 m-0 outline-none">
            {!interviewPrep && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{dictionary.aiAssistant.interviewTitle}</h3>
                  <p className="text-muted-foreground max-w-sm mt-1">
                    {dictionary.aiAssistant.interviewDesc}
                  </p>
                </div>
                <Button onClick={handleGenerateInterview} className="mt-4">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {dictionary.aiAssistant.btnGenerateInterview}
                </Button>
              </div>
            )}
            
            {isLoading && activeTab === "interview" && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">{dictionary.aiAssistant.loadingInterview}</p>
              </div>
            )}
            
            {error && activeTab === "interview" && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 text-destructive">
                <AlertCircle className="h-8 w-8" />
                <p>{error}</p>
                <Button variant="outline" onClick={handleGenerateInterview}>Try Again</Button>
              </div>
            )}
            
            {interviewPrep && !isLoading && (
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {interviewPrep}
                  </ReactMarkdown>
                </div>
                <div className="pt-4 border-t flex justify-end">
                  <Button variant="outline" onClick={handleGenerateInterview}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {dictionary.aiAssistant.btnRegenerate}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Resume Analysis Tab */}
          <TabsContent value="resume" className="p-6 m-0 outline-none">
            {!resumeFeedback && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{dictionary.aiAssistant.resumeTitle}</h3>
                  <p className="text-muted-foreground max-w-md mt-1">
                    {dictionary.aiAssistant.resumeDesc}
                  </p>
                </div>
                <Button onClick={handleGenerateResumeFeedback} className="mt-4">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {dictionary.aiAssistant.btnAnalyzeResume}
                </Button>
              </div>
            )}
            
            {isLoading && activeTab === "resume" && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">{dictionary.aiAssistant.loadingResume}</p>
              </div>
            )}
            
            {error && activeTab === "resume" && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 text-destructive">
                <AlertCircle className="h-8 w-8" />
                <p>{error}</p>
                <Button variant="outline" onClick={handleGenerateResumeFeedback}>Try Again</Button>
              </div>
            )}
            
            {resumeFeedback && !isLoading && (
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {resumeFeedback}
                  </ReactMarkdown>
                </div>
                <div className="pt-4 border-t flex justify-end">
                  <Button variant="outline" onClick={handleGenerateResumeFeedback}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {dictionary.aiAssistant.btnRegenerate}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
