"use client"

import { useState } from "react"

import { CategorySection } from "../components/category-section"
import { MenuSection } from "../components/menu-section"

const TABS = ["Menu Items", "Categories"] as const
type Tab = (typeof TABS)[number]

export function MenuPage() {
  const [tab, setTab] = useState<Tab>("Menu Items")

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Menu Management</h1>
        <p className="text-sm text-muted-foreground">Manage your restaurant menu items and categories.</p>
      </div>

      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "px-4 py-2 text-sm font-medium transition-colors " +
              (tab === t
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Menu Items" ? <MenuSection /> : <CategorySection />}
    </div>
  )
}
