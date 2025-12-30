"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, ArrowRight, Gavel, Loader2, LinkIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"

export function AllocationTrigger() {
  const { toast } = useToast()
  const [allocation, setAllocation] = useState<any | null>(null)

  const mutation = useMutation({
    mutationFn: () => api.allocate(),
    onSuccess: (data) => {
      setAllocation(data)
      toast({
        title: "Allocation Executed",
        description: "Optimal match found and committed to blockchain.",
      })
    },
  })

  const topRecipients = [
    { id: "0x7a...4e1f", organ: "LIVER", score: 88, blood: "O+", wait: "241 Days" },
    { id: "0x2c...8b3d", organ: "LIVER", score: 82, blood: "O+", wait: "115 Days" },
    { id: "0xf4...1a9e", organ: "LIVER", score: 79, blood: "A+", wait: "302 Days" },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                Active Allocator
              </CardTitle>
              <CardDescription>Trigger the automated allocation protocol for pending organs.</CardDescription>
            </div>
            <Button size="lg" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Trigger Allocation"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/20">
                PENDING ORGANS: 3
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                NETWORK STATUS: STABLE
              </Badge>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Recipient Hash</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Organ</TableHead>
                    <TableHead>Wait Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topRecipients.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {r.score}
                        </Badge>
                      </TableCell>
                      <TableCell>{r.organ}</TableCell>
                      <TableCell>{r.wait}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {allocation && (
        <Card className="border-green-500/20 bg-green-500/5 animate-in zoom-in-95 duration-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <ShieldCheck className="h-5 w-5" />
              Allocation Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Organ</p>
                <p className="font-bold">{allocation.organ}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Recipient</p>
                <p className="font-mono text-xs font-bold">{allocation.recipientHash}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Score</p>
                <p className="font-bold">{allocation.urgencyScore}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Time</p>
                <p className="text-sm font-medium">{allocation.timestamp}</p>
              </div>
            </div>
            <div className="p-3 bg-background border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <LinkIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Blockchain Tx Hash
                  </p>
                  <p className="text-xs font-mono">{allocation.txHash}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                View on Explorer <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
