import { CustomerPaymentPage } from "@/features/customer/pages/payment"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense>
      <CustomerPaymentPage />
    </Suspense>
  )
}
