"use client"

import { useQuery } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, ListOrdered, ShieldCheck } from "lucide-react"
import { api } from "@/lib/api"

type OverviewStats = {
  totalRecipients: number
  waitingRecipients: number
  totalDonors: number
  availableDonors: number
  allocationsToday: number
  avgWaitDays: number
}

export default function DashboardPage() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery<OverviewStats>({
    queryKey: ["overview-stats"],
    queryFn: () => api.getOverviewStats(),
  })

  const stats = [
    {
      title: "Total Recipients",
      value: data?.totalRecipients ?? 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Available Organs",
      value: data?.availableDonors ?? 0,
      icon: Activity,
      color: "text-green-500",
    },
    {
      title: "Allocations Today",
      value: data?.allocationsToday ?? 0,
      icon: ShieldCheck,
      color: "text-purple-500",
    },
    {
      title: "Average Wait Time",
      value: data ? `${data.avgWaitDays} Days` : "—",
      icon: ListOrdered,
      color: "text-orange-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Here is a summary of the organ allocation network status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-primary/5 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <span className="opacity-40">–</span> : stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>System Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "Oct 24, 2025",
                    title: "Blockchain Protocol Update",
                    content:
                      "The allocation verification protocol has been upgraded to v2.1 for faster consensus.",
                  },
                  {
                    date: "Oct 22, 2025",
                    title: "ML Model Retraining",
                    content:
                      "The liver urgency scoring model was retrained on new clinical data from Q3.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b last:border-0">
                    <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      {item.date}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
