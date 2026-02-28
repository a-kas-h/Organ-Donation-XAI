"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, MoreHorizontal } from "lucide-react"
import { api } from "@/lib/api"

type Donor = {
  _id: string
  donorId: string
  bloodType: string
  age: number
  createdAt?: string
}

export default function DonorListPage() {
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery<Donor[]>({
    queryKey: ["donors"],
    queryFn: () => api.getDonors(),
  })

  const donors = (data ?? []).filter((d) =>
    d.donorId.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Donor Registry</h1>
            <p className="text-muted-foreground">Manage registered organ donors.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Donor
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Registered Donors</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search donors..."
                    className="pl-8 w-[250px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <CardDescription>
              {isLoading
                ? "Loading donors..."
                : `A total of ${donors.length} donors are currently registered in the system.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor ID</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Registered Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="font-mono">
                        <div className="h-4 w-24 bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-10 bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-8 bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-20 bg-muted rounded" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 w-8 bg-muted rounded-full inline-block" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : donors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      No donors found.
                    </TableCell>
                  </TableRow>
                ) : (
                  donors.map((donor) => (
                    <TableRow key={donor._id}>
                      <TableCell className="font-mono">{donor.donorId}</TableCell>
                      <TableCell>{donor.bloodType}</TableCell>
                      <TableCell>{donor.age}</TableCell>
                      <TableCell>
                        {donor.createdAt ? new Date(donor.createdAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
