"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n/context"
import { 
  LayoutDashboard, 
  Briefcase, 
  Kanban, 
  Calendar, 
  Video, 
  Heart, 
  FileText, 
  BarChart, 
  Bot, 
  Settings 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GlobalSearch } from "./global-search"

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { dictionary } = useLanguage()

  const navigation = [
    { name: dictionary.sidebar.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: dictionary.sidebar.applications, href: '/applications', icon: Briefcase },
    { name: dictionary.sidebar.kanban, href: '/kanban', icon: Kanban },
    { name: dictionary.sidebar.calendar, href: '/calendar', icon: Calendar },
    { name: dictionary.sidebar.interviews, href: '/interviews', icon: Video },
    { name: dictionary.sidebar.wishlist, href: '/wishlist', icon: Heart },
    { name: dictionary.sidebar.resumes, href: '/resumes', icon: FileText },
    { name: dictionary.sidebar.analytics, href: '/analytics', icon: BarChart },
    { name: "AI Assistant", href: '/ai-assistant', icon: Bot },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card px-3 py-4">
      <div className="mb-6 px-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">ApplyMate</h1>
      </div>
      <div className="mb-4 px-3">
        <GlobalSearch />
      </div>
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={onNavigate}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-4">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
            pathname === '/settings'
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={onNavigate}
        >
          <Settings
            className={cn(
              "mr-3 h-5 w-5 flex-shrink-0",
              pathname === '/settings' ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
            )}
            aria-hidden="true"
          />
          {dictionary.sidebar.settings}
        </Link>
      </div>
    </div>
  )
}
