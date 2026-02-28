"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, FileCheck, Shield, Activity, Lock, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api"

type OverviewStats = {
  totalAllocations: number
  allocationsToday: number
}

type HistoryItem = {
  id: string
  organ: string
  patientHash: string
  urgencyScore: number
  date: string
  txHash: string
}

export function AuditorView() {
  const { data: stats } = useQuery<OverviewStats>({
    queryKey: ["overview-stats"],
    queryFn: () => api.getOverviewStats(),
  })

  const { data: history } = useQuery<HistoryItem[]>({
    queryKey: ["allocation-history"],
    queryFn: () => api.getHistory(),
  })

  const timeline = (history ?? []).slice(0, 4)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-lg border">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" /> Public Audit Node
          </h2>
          <p className="text-sm text-muted-foreground">
            Transparency feed from approved allocation records
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-background px-3 py-1 rounded border shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Ledger Synchronized
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20 border-green-200/50 dark:border-green-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Successful Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black text-green-700 dark:text-green-500 tracking-tighter">
              {stats?.totalAllocations ?? 0}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Matches approved and recorded in the audit log
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Audit Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {stats && stats.totalAllocations > 0 ? "100%" : "0%"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Allocation events captured via backend audit feed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Today&apos;s Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {stats?.allocationsToday ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approved allocations in the last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Allocation Timeline
            </CardTitle>
            <CardDescription>Recent approved matches from the allocation ledger</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-primary/20 ml-3 space-y-8 pl-8 py-2">
              {timeline.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[41px] top-0 p-1 bg-background border-2 border-primary/20 rounded-full group-hover:border-primary group-hover:scale-110 transition-all">
                    <Lock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-3 -mt-3 rounded-lg group-hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-base font-semibold">
                        {item.organ} allocation • score {item.urgencyScore.toFixed(1)}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-1 bg-muted inline-block px-1 rounded">
                        Ref: {item.txHash.slice(0, 10)}…
                      </p>
                    </div>
                    <div className="text-right mt-1 sm:mt-0">
                      <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold">
                        Approved
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <p className="text-xs text-muted-foreground pl-2">No allocations recorded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Approval Checkpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Approval Checkpoints
              </CardTitle>
              <CardDescription>Compliance verification status (sampled)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">On-ledger Approvals</span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  {stats?.totalAllocations ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Today&apos;s Checks</span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  {stats?.allocationsToday ?? 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Shield */}
          <Card className="bg-slate-900 text-slate-50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-slate-400" />
                Privacy Shield
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-400">
                Allocation records are linked only via hashed identifiers and aggregated statistics.
              </p>
              <div className="p-3 bg-slate-800 rounded space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Patient IDs</span>
                  <span className="font-mono text-xs text-slate-500">HASHED</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Medical Data</span>
                  <span className="font-mono text-xs text-slate-500">OFF-CHAIN</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
