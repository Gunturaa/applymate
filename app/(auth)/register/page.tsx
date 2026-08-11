"use client"

import { signup } from '../actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/components/ui/toast'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await signup(formData)

    setIsLoading(false)

    if (result?.error) {
      toast.add({
        title: "Registration Failed",
        description: result.error,
        type: "error",
      })
    } else if (result?.success) {
      toast.add({
        title: "Registration Successful",
        description: "Please check your email to confirm your account.",
        type: "success",
      })
      // We can redirect them to login or dashboard depending on email confirmation requirement
      router.push('/login')
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your details below to create your account
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
            <input id="email" name="email" type="email" placeholder="m@example.com" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
            <input id="password" name="password" type="password" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
          <button type="submit" disabled={isLoading} className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
