"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, MoreHorizontal, FileEdit, Trash2 } from "lucide-react"

export default function DonorListPage() {
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
                        <Input placeholder="Search donors..." className="pl-8 w-[250px]" />
                    </div>
                </div>
            </div>
            <CardDescription>
              A total of 1,280 donors are currently registered in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor ID</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "DON-9921", blood: "O+", age: 34, status: "Available", date: "2025-10-24" },
                  { id: "DON-9920", blood: "A-", age: 29, status: "matched", date: "2025-10-23" },
                  { id: "DON-9918", blood: "B+", age: 45, status: "Available", date: "2025-10-21" },
                  { id: "DON-9915", blood: "AB+", age: 52, status: "Available", date: "2025-10-20" },
                  { id: "DON-9912", blood: "O-", age: 22, status: "Pending", date: "2025-10-18" },
                ].map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-mono">{donor.id}</TableCell>
                    <TableCell>{donor.blood}</TableCell>
                    <TableCell>{donor.age}</TableCell>
                    <TableCell>
                         <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            donor.status === "Available" ? "bg-green-50 text-green-700 ring-green-600/20" : 
                            donor.status === "matched" ? "bg-blue-50 text-blue-700 ring-blue-600/20" : 
                            "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                         }`}>
                        {donor.status}
                      </span>
                    </TableCell>
                    <TableCell>{donor.date}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
