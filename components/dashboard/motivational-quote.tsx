"use client"
import React, { useState, useEffect } from "react"
import { Quote } from "lucide-react"

const quotes = {
  id: [
    "Setiap penolakan adalah satu langkah lebih dekat menuju pekerjaan impianmu.",
    "Jangan menyerah, pekerjaan yang tepat sedang menunggumu di waktu yang tepat.",
    "Kesuksesan adalah pertemuan antara persiapan dan kesempatan. Tetap bersiap!",
    "Istirahatlah jika lelah, tapi jangan pernah berhenti berusaha.",
    "Proses mencari kerja itu maraton, bukan lari sprint. Jaga staminamu!",
    "Bakat menentukan apa yang bisa kamu lakukan, tekad menentukan seberapa jauh kamu melangkah.",
    "Bahkan profesional paling hebat pun pernah ditolak berkali-kali.",
  ],
  en: [
    "Every rejection is one step closer to your dream job.",
    "Don't give up, the right job is waiting for you at the right time.",
    "Success is where preparation and opportunity meet. Keep preparing!",
    "Rest if you must, but don't you quit.",
    "Job hunting is a marathon, not a sprint. Pace yourself!",
    "Talent determines what you can do, determination determines how far you go.",
    "Even the most accomplished professionals have faced multiple rejections.",
  ]
}

export function MotivationalQuote({ locale }: { locale: string }) {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    const quoteList = locale === "id" ? quotes.id : quotes.en
    const randomIndex = Math.floor(Math.random() * quoteList.length)
    setQuote(quoteList[randomIndex])
  }, [locale])

  if (!quote) return null // Hide until hydration completes

  return (
    <div className="flex items-center gap-2 mt-1 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg max-w-2xl shadow-sm animate-in fade-in duration-500">
      <Quote className="h-4 w-4 shrink-0 opacity-70" />
      <p className="text-sm font-medium italic">{quote}</p>
    </div>
  )
}
