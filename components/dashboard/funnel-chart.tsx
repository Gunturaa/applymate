"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FunnelChart({ applications = [] }: { applications?: any[] }) {
  const counts: Record<string, number> = {
    wishlist: 0,
    applied: 0,
    screening: 0,
    assessment: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    hired: 0
  }

  applications.forEach(app => {
    const status = app.status?.toLowerCase()
    if (counts[status] !== undefined) counts[status]++
  })

  const data = [
    { name: "Wishlist", count: counts.wishlist },
    { name: "Applied", count: counts.applied },
    { name: "Screening", count: counts.screening },
    { name: "Assessment", count: counts.assessment },
    { name: "Interview", count: counts.interview },
    { name: "Offer", count: counts.offer },
    { name: "Rejected", count: counts.rejected },
    { name: "Hired", count: counts.hired },
  ].filter(item => item.count > 0 || item.name === 'Applied' || item.name === 'Interview')

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
        <CardDescription>Your pipeline from application to offer</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
