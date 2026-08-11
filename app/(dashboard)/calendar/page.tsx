import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getLanguage } from "@/lib/i18n/server"

export default async function CalendarPage() {
  const supabase = await createClient()
  const { dictionary, locale } = await getLanguage()

  // Fetch interviews
  const { data: interviewsData } = await supabase
    .from('interviews')
    .select('*, applications(position, companies(name))')

  const interviews = interviewsData || []

  const days = locale === 'id' 
    ? ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  // Calculate current month data
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-11
  const today = now.getDate()
  
  const monthName = now.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() // 0-6
  
  const monthData = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  
  // Map interviews to calendar events
  const events = interviews.map(inv => {
    const d = new Date(inv.scheduled_at)
    return {
      date: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      title: `${inv.applications?.companies?.name || 'Interview'} - ${inv.applications?.position || ''}`,
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: "interview"
    }
  }).filter(e => e.month === currentMonth && e.year === currentYear)

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{dictionary.sidebar.calendar}</h2>
          <p className="text-muted-foreground">{locale === 'id' ? 'Pantau wawancara dan tenggat waktu Anda.' : 'Keep track of your interviews and deadlines.'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold px-4">{monthName}</div>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {days.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px] bg-border gap-px">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-card opacity-50 p-2" />
          ))}
          {monthData.map(day => {
            const dayEvents = events.filter(e => e.date === day)
            const isToday = day === today
            
            return (
              <div key={day} className="bg-card p-2 flex flex-col hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                  isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                }`}>
                  {day}
                </span>
                <div className="flex flex-col gap-1 overflow-y-auto">
                  {dayEvents.map((evt, i) => (
                    <div 
                      key={i} 
                      className={`text-xs p-1.5 rounded-md truncate cursor-pointer hover:opacity-80 transition-opacity ${
                        evt.type === 'interview' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                      title={evt.title}
                    >
                      <div className="font-semibold truncate">{evt.title}</div>
                      <div className="opacity-80">{evt.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {Array.from({ length: 42 - (firstDayOfMonth + daysInMonth) }).map((_, i) => (
            <div key={`empty-end-${i}`} className="bg-card opacity-50 p-2" />
          ))}
        </div>
      </div>
    </div>
  )
}
