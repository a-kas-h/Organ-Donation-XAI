import { LoginForm } from "@/components/auth/login-form"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-primary">OrganChain</h1>
      </div>
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700 delay-200">
        <LoginForm />
      </div>
    </div>
  )
}
