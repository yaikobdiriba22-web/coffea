'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const form = new FormData(event.currentTarget)
    const body = {
      email: form.get('email'),
      password: form.get('password'),
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result.error || 'Failed to log in')
      setIsLoading(false)
      return
    }

    if (result.user?.role !== 'ADMIN') {
      setError('This account is not authorized for admin access.')
      setIsLoading(false)
      return
    }

    router.push('/admin')
    setIsLoading(false)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-oak">Admin login</h1>
        <p className="mt-2 text-stone-600">Sign in to manage menu, orders, and customers.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-oak">Email</label>
            <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Password</label>
            <input name="password" type="password" required className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full rounded-full bg-coffee-700 px-5 py-3 font-medium text-white">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-600">
          <Link href="/login" className="font-medium text-coffee-700">Customer login</Link>
        </p>
      </div>
    </div>
  )
}
