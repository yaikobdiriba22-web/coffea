'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { decodeSession } from '@/lib/auth'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setUser(data.user)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center">Loading...</div>

  if (!user) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-oak">My account</h1>
        <button
          onClick={handleLogout}
          className="rounded-full border border-stone-300 px-6 py-2 font-medium text-stone-700 hover:bg-stone-50"
        >
          Log out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-oak">Profile</h2>
          <div className="mt-4 space-y-3 text-stone-700">
            <div>
              <p className="text-sm text-stone-500">Name</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Member since</p>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-oak">Quick links</h2>
          <div className="mt-4 space-y-2">
            <Link href="/account/orders" className="block rounded-lg bg-coffee-50 px-4 py-2 text-coffee-700 font-medium hover:bg-coffee-100">
              My orders
            </Link>
            <Link href="/menu" className="block rounded-lg bg-stone-50 px-4 py-2 text-stone-700 font-medium hover:bg-stone-100">
              Browse menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
