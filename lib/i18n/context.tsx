"use client"

import React, { createContext, useContext, useState } from "react"
import en from "@/dictionaries/en.json"
import id from "@/dictionaries/id.json"

export type Locale = "en" | "id"
export type Dictionary = typeof en

interface LanguageContextType {
  locale: Locale
  dictionary: Dictionary
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ 
  children, 
  initialLocale = "en" 
}: { 
  children: React.ReactNode
  initialLocale?: Locale 
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const dictionary = locale === "id" ? id : en

  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale)
    const { setLanguageCookie } = await import("@/app/actions/language")
    await setLanguageCookie(newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, dictionary, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
