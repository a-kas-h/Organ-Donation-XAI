"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, Truck, Activity } from "lucide-react"

export default function AllocationStatusPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
           <h1 className="text-2xl font-bold tracking-tight">Allocation Status</h1>
           <p className="text-muted-foreground">Real-time tracking of active allocations for your patients.</p>
        </div>

        <div className="grid gap-6">
           {/* Card 1: Active Match */}
           <Card className="border-l-4 border-l-green-500">
               <CardHeader>
                   <div className="flex items-center justify-between">
                       <CardTitle className="text-lg flex items-center gap-2">
                           <Activity className="h-5 w-5 text-green-600" />
                           Match Confirmed: Kidney Allocation
                       </CardTitle>
                       <Badge className="bg-green-600">Action Required</Badge>
                   </div>
                   <CardDescription>Recipient: Jane Smith (REC-1029) • Donor: DON-8821</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                   <div className="relative pt-2 pb-6">
                       <div className="absolute top-0 left-4 h-full w-0.5 bg-muted" />
                       
                       <div className="relative pl-10 pb-6">
                            <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-green-600 ring-4 ring-background" />
                            <p className="font-semibold text-sm">Match Identified by ML Engine</p>
                            <p className="text-xs text-muted-foreground">Today, 09:42 AM</p>
                       </div>
                       <div className="relative pl-10 pb-6">
                            <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-green-600 ring-4 ring-background" />
                             <p className="font-semibold text-sm">Surgeon Acceptance</p>
                             <p className="text-xs text-muted-foreground">Today, 10:15 AM • Dr. Wilson approved</p>
                       </div>
                       <div className="relative pl-10">
                            <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-blue-500 animate-pulse ring-4 ring-background" />
                             <p className="font-semibold text-sm text-blue-600">Transport Logistics</p>
                             <p className="text-xs text-muted-foreground">In Progress • ETA 2 Hours</p>
                             <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900">
                                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                                    <Truck className="h-4 w-4" />
                                    <span>Transit Team #4 dispatched. GPS Tracking Active.</span>
                                </div>
                             </div>
                       </div>
                   </div>
               </CardContent>
           </Card>

           {/* Card 2: Pending */}
            <Card className="border-l-4 border-l-orange-400">
               <CardHeader>
                   <div className="flex items-center justify-between">
                       <CardTitle className="text-lg flex items-center gap-2">
                           <Clock className="h-5 w-5 text-orange-500" />
                           Pending Match: Liver Allocation
                       </CardTitle>
                       <Badge variant="outline" className="text-orange-500 border-orange-200">Processing</Badge>
                   </div>
                   <CardDescription>Recipient: John Doe (REC-4492) • Urgency Score: 9.2 (High)</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                   <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                           <span className="font-medium">Cross-matching Donor Pool</span>
                           <span className="text-muted-foreground">75% Complete</span>
                       </div>
                       <Progress value={75} className="h-2" />
                   </div>
                   <p className="text-sm text-muted-foreground">
                       System is currently evaluating 3 potential donor matches against antibody profiles. Estimating completion in 15 minutes.
                   </p>
               </CardContent>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
