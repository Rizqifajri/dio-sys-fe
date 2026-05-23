import { Suspense } from "react"
import { CustomerMenuPage } from "@/features/customer/pages/menu"

export default function Page() {
  return (
    <Suspense>
      <CustomerMenuPage />
    </Suspense>
  )
}
