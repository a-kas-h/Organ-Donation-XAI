import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404 - Unauthorized Access</h1>
      <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
        The requested node or page could not be found or you do not have the required clearance to view this resource.
      </p>
      <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
        <Button asChild variant="default">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
