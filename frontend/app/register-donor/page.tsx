import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DonorForm } from "@/components/admin/donor-form"

export default function RegisterDonorPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Donor Registration</h1>
          <p className="text-muted-foreground mt-1">Admin tool to record newly available organs in the network.</p>
        </div>
        <DonorForm />
      </div>
    </DashboardLayout>
  )
}
