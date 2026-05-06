"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, LogOut, Package, ShoppingCart, User } from "lucide-react"

import { useLogout } from "@/features/auth/hooks/use-auth"
import { ConfirmationModal } from "@/components/confirmation-modals"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Menu", href: "/menu", icon: BookOpen },
  { title: "Inventory", href: "/inventory", icon: Package },
  { title: "Order", href: "/order", icon: ShoppingCart },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { mutate: logout, isPending } = useLogout()

  return (
    <>
    <ConfirmationModal
      open={showLogoutModal}
      onOpenChange={setShowLogoutModal}
      onConfirm={() => logout()}
      title="Sign out"
      description="Are you sure you want to sign out?"
      confirmLabel="Sign out"
      isPending={isPending}
    />
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
                  D
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">DIO Systems</span>
                  <span className="text-xs text-muted-foreground">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
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
              asChild
              isActive={pathname === "/account"}
              tooltip="Account"
            >
              <Link href="/account">
                <User />
                <span>Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setShowLogoutModal(true)}
              tooltip="Logout"
              className="text-destructive hover:text-destructive focus-visible:text-destructive"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
    </>
  )
}
