import { Suspense } from "react"
import { CustomerCartPage } from "@/features/customer/pages/cart"

export default function Page() {
  return (
    <Suspense>
      <CustomerCartPage />
    </Suspense>
  )
}
