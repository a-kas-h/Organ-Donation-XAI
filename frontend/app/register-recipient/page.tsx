import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RecipientForm } from "@/components/doctor/recipient-form"

export default function RegisterRecipientPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Register Transplant Recipient</h1>
          <p className="text-muted-foreground mt-1">
            Securely register a patient and calculate their urgency score using our ML engine.
          </p>
        </div>
        <RecipientForm />
      </div>
    </DashboardLayout>
  )
}
