"use client"

import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, ShieldCheck, Info, BrainCircuit } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { api } from "@/lib/api"

type AllocationRecord = {
  id: string
  organ: string
  patientHash: string
  urgencyScore: number
  date: string
  txHash: string
  shap: { name: string; value: number }[]
}

export function AllocationHistoryTimeline() {
  const { data, isLoading } = useQuery<AllocationRecord[]>({
    queryKey: ["allocation-history"],
    queryFn: () => api.getHistory(),
  })

  return (
    <Card className="border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Blockchain Allocation Ledger
        </CardTitle>
        <CardDescription>Verified immutable record of organ allocations and the logic behind them.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Organ</TableHead>
                <TableHead>Recipient Hash</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Blockchain Proof</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : data?.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell>
                        <Badge variant="outline">{item.organ}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{item.patientHash}</TableCell>
                      <TableCell className="font-bold text-primary">{item.urgencyScore}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                          <span className="truncate max-w-[120px]">{item.txHash}</span>
                          <ExternalLink className="h-3 w-3 cursor-pointer hover:text-primary" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                              <Info className="h-3 w-3" />
                              View Proof
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-primary" />
                                Allocation Proof: {item.patientHash}
                              </DialogTitle>
                              <DialogDescription>
                                Auditable explanation for why this patient was selected by the model.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border rounded-lg bg-muted/30">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Urgency Score</p>
                                  <p className="text-2xl font-bold text-primary">{item.urgencyScore}</p>
                                </div>
                                <div className="p-3 border rounded-lg bg-muted/30">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold">
                                    Transaction ID
                                  </p>
                                  <p className="text-xs font-mono truncate">{item.txHash}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                  <Info className="h-4 w-4 text-primary" />
                                  Model Explanation (SHAP)
                                </h4>
                                <div className="h-[250px] w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={item.shap} layout="vertical" margin={{ left: 40 }}>
                                      <XAxis type="number" hide />
                                      <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={80}
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                      />
                                      <Tooltip />
                                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {item.shap.map((entry, idx) => (
                                          <Cell
                                            key={`cell-${idx}`}
                                            fill={entry.value > 0 ? "oklch(0.55 0.18 25)" : "oklch(0.55 0.15 160)"}
                                          />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                                <p className="text-xs text-muted-foreground italic leading-relaxed">
                                  This allocation was determined by matching clinical urgency with the available donor
                                  organ profile. The cryptographic proof on the blockchain ensures that no manual
                                  override or preferential treatment occurred.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
