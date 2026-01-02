"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, FileCheck, Server, AlertCircle, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function CompliancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
           <h1 className="text-2xl font-bold tracking-tight">Approval Checkpoints</h1>
           <p className="text-muted-foreground">System-wide compliance and regulatory verification logs.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {/* Card 1: HIPAA */}
             <Card className="border-l-4 border-l-green-500 shadow-sm">
                 <CardHeader>
                     <div className="flex items-center justify-between">
                         <CardTitle className="flex items-center gap-2 text-base">
                             <Shield className="h-4 w-4 text-green-600" />
                             HIPAA Compliance
                         </CardTitle>
                         <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">VERIFIED</Badge>
                     </div>
                 </CardHeader>
                 <CardContent>
                     <div className="space-y-4">
                         <div className="text-sm">
                             <span className="text-muted-foreground">Last Audit:</span> <span className="font-medium">2 mins ago</span>
                         </div>
                         <div className="space-y-2">
                             <div className="flex justify-between text-xs">
                                 <span>Data Encryption</span>
                                 <span>AES-256</span>
                             </div>
                             <Progress value={100} className="h-1.5" />
                         </div>
                          <div className="space-y-2">
                             <div className="flex justify-between text-xs">
                                 <span>Access Controls</span>
                                 <span>Strict RBAC</span>
                             </div>
                             <Progress value={100} className="h-1.5" />
                         </div>
                     </div>
                 </CardContent>
             </Card>

              {/* Card 2: Fairness */}
             <Card className="border-l-4 border-l-blue-500 shadow-sm">
                 <CardHeader>
                     <div className="flex items-center justify-between">
                         <CardTitle className="flex items-center gap-2 text-base">
                             <Eye className="h-4 w-4 text-blue-600" />
                             Fairness Algorithms
                         </CardTitle>
                         <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">OPTIMAL</Badge>
                     </div>
                 </CardHeader>
                 <CardContent>
                     <div className="space-y-4">
                         <div className="text-sm">
                             <span className="text-muted-foreground">Bias Check:</span> <span className="font-medium">Passed (p &lt; 0.001)</span>
                         </div>
                         <div className="p-3 bg-muted rounded-md text-xs space-y-2">
                             <div className="flex justify-between">
                                 <span>Demographic Parity</span>
                                 <span className="text-green-600 font-mono">0.02 (Low)</span>
                             </div>
                             <div className="flex justify-between">
                                 <span>Urgency Weighting</span>
                                 <span className="text-green-600 font-mono">Verified</span>
                             </div>
                         </div>
                     </div>
                 </CardContent>
             </Card>

              {/* Card 3: Blockchain */}
             <Card className="border-l-4 border-l-purple-500 shadow-sm">
                 <CardHeader>
                     <div className="flex items-center justify-between">
                         <CardTitle className="flex items-center gap-2 text-base">
                             <Lock className="h-4 w-4 text-purple-600" />
                             Immutable Ledger
                         </CardTitle>
                         <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">SYNCED</Badge>
                     </div>
                 </CardHeader>
                 <CardContent>
                     <div className="space-y-4">
                         <div className="text-sm">
                             <span className="text-muted-foreground">Block Height:</span> <span className="font-mono">#8,992,102</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                             <Server className="h-3 w-3" />
                             <span>All transaction logs are hashed and replicated across 5 audit nodes.</span>
                         </div>
                     </div>
                 </CardContent>
             </Card>
        </div>

        {/* Detailed Logs Table */}
        <Card>
            <CardHeader>
                <CardTitle>Recent Verification Logs</CardTitle>
                <CardDescription>Detailed audit trail of system compliance checks.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {[
                        { id: "LOG-921", check: "PII Masking Test", status: "Pass", time: "10:00 AM", detail: "0 leaks detected in payload." },
                        { id: "LOG-920", check: "Allocation Logic Variance", status: "Pass", time: "09:55 AM", detail: "Deviations within 0.01% tolerance." },
                        { id: "LOG-919", check: "Node Consensus", status: "Pass", time: "09:50 AM", detail: "5/5 nodes signed block #8992100." },
                        { id: "LOG-918", check: "Latency Threshold", status: "Warning", time: "09:45 AM", detail: "Response 250ms > 200ms target." },
                    ].map((log) => (
                        <div key={log.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex gap-3">
                                <div className={`mt-1 h-2 w-2 rounded-full ${log.status === "Pass" ? "bg-green-500" : "bg-yellow-500"}`} />
                                <div>
                                    <p className="font-medium text-sm">{log.check}</p>
                                    <p className="text-xs text-muted-foreground">{log.detail}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant="outline" className="mb-1 font-mono text-[10px]">{log.id}</Badge>
                                <p className="text-xs text-muted-foreground">{log.time}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
