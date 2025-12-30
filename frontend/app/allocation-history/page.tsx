import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AllocationHistoryTimeline } from "@/components/shared/allocation-history-timeline"

export default function AllocationHistoryPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Allocation History</h1>
          <p className="text-muted-foreground mt-1">
            Immutable ledger of all organ matches and clinical justifications.
          </p>
        </div>
        <AllocationHistoryTimeline />
      </div>
    </DashboardLayout>
  )
}
