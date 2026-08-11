"use client"
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from "recharts"

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#64748b']
const SOURCE_COLORS = ['#0077b5', '#64748b', '#10b981', '#f59e0b', '#94a3b8']

interface AnalyticsChartsProps {
  applicationTrends: any[]
  statusDistribution: any[]
  sourceData: any[]
}

export function AnalyticsCharts({ applicationTrends, statusDistribution, sourceData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Application Activity</CardTitle>
          <CardDescription>Number of applications sent over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={applicationTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Distribution of your applications by current status.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Sources</CardTitle>
          <CardDescription>Where you are finding your opportunities.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={100} />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
