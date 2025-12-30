import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WaitingListTable } from "@/components/shared/waiting-list-table"

export default function WaitingListPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Waiting List</h1>
          <p className="text-muted-foreground mt-1">Real-time priority list of transplant recipients.</p>
        </div>
        <WaitingListTable />
      </div>
    </DashboardLayout>
  )
}
