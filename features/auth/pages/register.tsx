import Link from "next/link"
import { RegisterForm } from "@/features/auth/form/register-form"

export const metadata = {
  title: "Create account — RestaurantOS",
}

export default function Register() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Get your restaurant set up in under a minute
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-orange-500 hover:text-orange-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}