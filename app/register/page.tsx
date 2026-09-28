'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const body = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone: formData.get('phone'),
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Registration failed')
        return
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-oak">Create account</h1>
          <p className="mt-2 text-stone-600">Join Coffea to track orders and manage preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-oak">Full name</label>
            <input
              type="text"
              name="name"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
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
            <label className="block text-sm font-medium text-oak">Phone</label>
            <input
              type="tel"
              name="phone"
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
            <p className="mt-1 text-xs text-stone-500">Minimum 8 characters</p>
          </div>
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-coffee-700 px-4 py-2 font-medium text-white transition hover:bg-coffee-800 disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-coffee-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
