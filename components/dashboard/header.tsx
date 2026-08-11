"use client"

import { Bell, Search, User, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/i18n/context"

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { dictionary } = useLanguage()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4">
        <button
          type="button"
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground focus:outline-none"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="w-full max-w-md relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-transparent"
            placeholder={dictionary.header.search}
          />
        </div>
      </div>
      <div className="ml-4 flex items-center md:ml-6 space-x-2">
        <LanguageToggle />
        <ThemeToggle />
        
        <button
          type="button"
          className="relative rounded-full bg-background p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>
        
        {/* We will replace this with a proper DropdownMenu once shadcn is ready */}
        <div className="relative">
          <button className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
