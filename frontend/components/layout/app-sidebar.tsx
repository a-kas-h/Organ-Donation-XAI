"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { LayoutDashboard, UserPlus, HeartHandshake, ListOrdered, History, LogOut, ShieldCheck, Database, Activity, FileCheck } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

const NAVIGATION = [
  // Common
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["DOCTOR", "ADMIN", "AUDITOR"],
  },
  
  // Doctor Routes
  {
    title: "Register Donor",
    url: "/register-donor",
    icon: HeartHandshake,
    roles: ["DOCTOR"],
  },
  {
    title: "Register Recipient",
    url: "/register-recipient",
    icon: UserPlus,
    roles: ["DOCTOR"],
  },
  {
    title: "Allocation Status",
    url: "/allocation-status",
    icon: Activity,
    roles: ["DOCTOR"],
  },
  {
    title: "Allocation History",
    url: "/allocation-history",
    icon: History,
    roles: ["DOCTOR"],
  },

  // Admin Routes
  {
    title: "Donor Entries",
    url: "/donor-list",
    icon: Database,
    roles: ["ADMIN"],
  },
  {
    title: "Recipient Entries",
    url: "/waiting-list",
    icon: ListOrdered,
    roles: ["ADMIN"],
  },
  {
    title: "Trigger Allocation",
    url: "/allocation-dashboard",
    icon: ShieldCheck,
    roles: ["ADMIN"],
  },

  // Auditor Routes
  {
    title: "Allocation Timeline",
    url: "/allocation-history",
    icon: Activity,
    roles: ["AUDITOR"],
  },
  {
    title: "Approval Checkpoints",
    url: "/compliance",
    icon: FileCheck,
    roles: ["AUDITOR"],
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredNav = NAVIGATION.filter((item) => user && item.roles.includes(user.role))

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-2 font-bold text-primary">
          <ShieldCheck className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">OrganChain</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
