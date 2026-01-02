"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Users, Database, Play, AlertTriangle, ArrowRight, Settings } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function AdminView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registered Donors</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,280</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-600 font-medium">↑ 12% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Waiting Recipients</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3,402</div>
            <p className="text-xs text-muted-foreground mt-1 text-red-500 font-medium">↑ 5 High Urgency today</p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">System Health</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Operational</div>
            <p className="text-xs text-primary-foreground/70 mt-1">All systems nominal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action - Trigger Allocation (Takes up 2/3) */}
        <Card className="lg:col-span-2 border-primary/20 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <CardHeader>
                <div className="flex items-center gap-2">
                     <Badge variant="outline" className="text-primary border-primary/30">ML Engine v2.1</Badge>
                     <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Ready</Badge>
                </div>
                <CardTitle className="text-2xl pt-2">Trigger Organ Allocation</CardTitle>
                <CardDescription>
                    Initiate the AI-driven matching process. The system will analyze donor availability against the recipient waiting list using the multi-factor scoring model.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground block mb-1">Pending Matches</span>
                        <span className="font-semibold text-lg">42 Potential</span>
                    </div>
                     <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground block mb-1">Est. Processing Time</span>
                        <span className="font-semibold text-lg">~120ms</span>
                    </div>
                </div>
                
                <Link href="/allocation-dashboard">
                    <Button size="lg" className="w-full text-lg h-14 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold">
                        <Play className="mr-2 h-5 w-5 fill-current" /> Start Allocation Engine
                    </Button>
                </Link>
            </CardContent>
        </Card>

        {/* Database Management Links */}
        <div className="space-y-4">
             <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                 <Link href="/donor-list">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                            Manage Donors 
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">View and edit donor registry entries.</p>
                    </CardContent>
                </Link>
            </Card>

             <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                 <Link href="/waiting-list">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                            Manage Recipients
                             <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Prioritize and manage waiting list.</p>
                    </CardContent>
                </Link>
            </Card>

            <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50">
                <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-500 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> System Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-amber-700/80 dark:text-amber-500/80">3 flagged entries require manual review before next allocation cycle.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
