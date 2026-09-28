'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Login failed')
        return
      }

      const data = await res.json()
      if (data.user.role !== 'ADMIN') {
        setError('Admin access required')
        return
      }

      router.push('/admin/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-oak">Admin Portal</h1>
          <p className="mt-2 text-stone-600">Log in to manage Coffea</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-oak">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Password</label>
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-coffee-700 px-4 py-2 font-medium text-white transition hover:bg-coffee-800 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}
