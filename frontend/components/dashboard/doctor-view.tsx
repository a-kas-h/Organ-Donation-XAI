"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, UserPlus, HeartHandshake, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function DoctorView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero / Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-primary">Allocation Status</CardTitle>
                <Activity className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <CardDescription className="text-primary/80">Real-time matching updates for your patients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Patient: John Doe (Liver)</span>
                    <span className="text-orange-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Matching in Progress</span>
                </div>
                <Progress value={65} className="h-3 bg-primary/10" />
                <p className="text-xs text-muted-foreground pt-1">ML Analysis Complete • Cross-matching with Donor Pool...</p>
            </div>
             <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Patient: Jane Smith (Kidney)</span>
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Match Found</span>
                </div>
                <Progress value={100} className="h-3 bg-green-100 dark:bg-green-900/30 [&>div]:bg-green-600" />
                <p className="text-xs text-muted-foreground pt-1">Surgeon Alerted • Transport Logistics Initialized</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - "Register" cards */}
        <div className="space-y-4">
             <Link href="/register-donor" className="block group">
              <Card className="transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer border-l-4 border-l-green-500">
                  <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:scale-110 transition-transform">
                              <HeartHandshake className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                              <h3 className="font-bold text-lg">Register Donor</h3>
                              <p className="text-sm text-muted-foreground">Log new donor availability</p>
                          </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </CardContent>
              </Card>
            </Link>

            <Link href="/register-recipient" className="block group">
              <Card className="transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer border-l-4 border-l-blue-500">
                  <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform">
                              <UserPlus className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                              <h3 className="font-bold text-lg">Register Recipient</h3>
                              <p className="text-sm text-muted-foreground">Add new patient to waiting list</p>
                          </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </CardContent>
              </Card>
            </Link>
        </div>
      </div>

      {/* Allocation History Preview */}
      <h2 className="text-lg font-semibold tracking-tight">Recent Allocation History</h2>
      <Card className="overflow-hidden border-muted">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Patient</th>
                        <th className="px-6 py-3">Organ</th>
                        <th className="px-6 py-3">Matched On</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {[
                        { id: "A-5592", patient: "Michael B.", organ: "Heart", date: "Oct 24, 2025", status: "Completed" },
                        { id: "A-5591", patient: "Sarah L.", organ: "Kidney", date: "Oct 22, 2025", status: "In Surgery" },
                        { id: "A-5588", patient: "David K.", organ: "Liver", date: "Oct 20, 2025", status: "Transport" },
                    ].map((row) => (
                        <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                            <td className="px-6 py-4 font-medium">{row.patient}</td>
                            <td className="px-6 py-4">{row.organ}</td>
                            <td className="px-6 py-4 text-muted-foreground">{row.date}</td>
                            <td className="px-6 py-4">
                                <Badge variant={row.status === "Completed" ? "default" : "secondary"} 
                                    className={row.status === "Completed" ? "bg-green-600 hover:bg-green-700" : ""}>
                                    {row.status}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="p-4 border-t bg-muted/20 text-center">
            <Link href="/allocation-history" className="text-sm font-medium text-primary hover:underline">
                View All Allocations
            </Link>
        </div>
      </Card>
    </div>
  )
}
