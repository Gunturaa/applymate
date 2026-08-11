import { cookies } from "next/headers"
import en from "@/dictionaries/en.json"
import id from "@/dictionaries/id.json"
import { Locale, Dictionary } from "./context"

export async function getLanguage(): Promise<{ locale: Locale, dictionary: Dictionary }> {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as Locale
  const dictionary = locale === "id" ? id : en
  return { locale, dictionary }
}
