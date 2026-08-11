"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calculator, Calendar, CreditCard, Settings, Smile, User, Briefcase, FileText, Bot } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between text-sm text-muted-foreground bg-muted/50 hover:bg-muted p-2 rounded-md border shadow-sm transition-colors"
      >
        <span className="flex items-center">
          <SearchIcon className="mr-2 h-4 w-4" />
          Search...
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push('/applications'))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Job Applications</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/calendar'))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar & Interviews</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/resumes'))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Resumes Manager</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/ai-assistant'))}>
              <Bot className="mr-2 h-4 w-4" />
              <span>AI Assistant</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => router.push('/settings/profile'))}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
