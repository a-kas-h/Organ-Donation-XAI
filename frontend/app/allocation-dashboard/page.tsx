import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AllocationTrigger } from "@/components/admin/allocation-trigger"

export default function AllocationDashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Allocation Management</h1>
          <p className="text-muted-foreground mt-1">
            Execute the cryptographic allocation protocol to match organs with patients.
          </p>
        </div>
        <AllocationTrigger />
      </div>
    </DashboardLayout>
  )
}
