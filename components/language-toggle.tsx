"use client"

import * as React from "react"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("en")} className={locale === "en" ? "bg-accent" : ""}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("id")} className={locale === "id" ? "bg-accent" : ""}>
          Bahasa Indonesia
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
