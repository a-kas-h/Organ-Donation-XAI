"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCcw, Filter, User } from "lucide-react"
import { api } from "@/lib/api"

type Recipient = {
  id: string
  patientHash: string
  urgencyScore: number
  organ: string
  status: string
  timestamp: string
}

export function WaitingListTable() {
  const [organFilter, setOrganFilter] = useState<string>("ALL")

  const { data, isLoading, isFetching } = useQuery<Recipient[]>({
    queryKey: ["waiting-list", organFilter],
    queryFn: () => api.getWaitingList(organFilter),
    refetchInterval: 10000, // Auto-refresh every 10s
  })

  return (
    <Card className="border-primary/10 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Live Waiting List</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isFetching ? (
              <RefreshCcw className="h-3 w-3 animate-spin text-primary" />
            ) : (
              <RefreshCcw className="h-3 w-3" />
            )}
            Auto-refreshes every 10s
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={organFilter} onValueChange={setOrganFilter}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Filter by Organ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Organs</SelectItem>
              <SelectItem value="LIVER">Liver</SelectItem>
              <SelectItem value="HEART">Heart</SelectItem>
              <SelectItem value="KIDNEY">Kidney</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead>Patient Hash</TableHead>
                <TableHead>Organ</TableHead>
                <TableHead>Urgency Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No patients currently waiting for {organFilter.toLowerCase()}.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((recipient, index) => (
                  <TableRow key={recipient.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-muted-foreground">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <span className="font-mono text-xs">{recipient.patientHash}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold text-[10px] tracking-wider uppercase">
                        {recipient.organ}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${recipient.urgencyScore}%`, opacity: recipient.urgencyScore / 100 + 0.2 }}
                          />
                        </div>
                        <span className="font-bold text-sm">{recipient.urgencyScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">
                        {recipient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-medium">
                      {recipient.timestamp}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
