"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  Building2,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldCheck,
  ShoppingCart,
  Monitor,
  User,
  Users,
} from "lucide-react"

import { getStoredUser, useLogout } from "@/features/auth/hooks/use-auth"
import { useUserPermissions } from "@/features/auth/hooks/use-permissions"
import { filterPermission } from "@/lib/filter-permission"
import { PERMISSIONS, type Permission } from "@/constants/permissions"
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

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  /** Empty = visible to all authenticated dashboard users */
  permissions?: Permission[]
}

interface NavGroup {
  label: string
  /** Which login scopes see this group. Omit = all scopes. */
  scopes?: Array<"GLOBAL" | "TENANT">
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operations",
    scopes: ["TENANT"],
    items: [
      { title: "POS Kasir", href: "/pos", icon: Monitor, permissions: [PERMISSIONS.ORDER_CREATE] },
      { title: "Menu", href: "/menu", icon: BookOpen, permissions: [PERMISSIONS.MENU_READ] },
      { title: "Inventory", href: "/inventory", icon: Package, permissions: [PERMISSIONS.MENU_READ] },
      { title: "Order", href: "/order", icon: ShoppingCart, permissions: [PERMISSIONS.ORDER_READ] },
    ],
  },
  {
    label: "Administration",
    scopes: ["GLOBAL"],
    items: [
      { title: "Users", href: "/users", icon: Users, permissions: [PERMISSIONS.USER_READ] },
      { title: "Roles", href: "/roles", icon: ShieldCheck, permissions: [PERMISSIONS.ROLE_READ] },
      { title: "Tenants", href: "/tenants", icon: Building2, permissions: [PERMISSIONS.TENANT_READ] },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { mutate: logout, isPending } = useLogout()
  const userPermissions = useUserPermissions()
  const userScope = getStoredUser()?.scope

  const allowedGroups = navGroups
    .filter(
      (group) =>
        !group.scopes?.length ||
        userScope === "GLOBAL" ||
        (userScope && group.scopes.includes(userScope)),
    )
    .map((group) => ({
      ...group,
      items: filterPermission(group.items, (item) => {
        if (!item.permissions?.length) return true
        return item.permissions.some((p) => userPermissions.includes(p))
      }),
    }))
    .filter((group) => group.items.length > 0)

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
                <Link href="/dashboard">
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
          {allowedGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          pathname === item.href ||
                          (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))
                        }
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
          ))}
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
