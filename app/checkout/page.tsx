'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [subtotal, setSubtotal] = useState(0)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const body = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      orderType: formData.get('orderType'),
      deliveryAddress: formData.get('address'),
      notes: formData.get('notes'),
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to place order')
        setIsLoading(false)
        return
      }

      const data = await res.json()
      router.push(`/order/success?order=${data.orderNumber}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-oak">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-oak">Full name *</label>
            <input name="name" required className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-oak">Email *</label>
              <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-oak">Phone *</label>
              <input name="phone" required className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Order type *</label>
            <select name="orderType" defaultValue="PICKUP" className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700">
              <option value="PICKUP">Pickup</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Delivery address</label>
            <textarea name="address" rows={3} className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Additional notes</label>
            <textarea name="notes" rows={3} className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full rounded-full bg-coffee-700 px-5 py-3 font-medium text-white transition hover:bg-coffee-800 disabled:opacity-50">
            {isLoading ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-oak">Order summary</h2>
          <div className="mt-5 space-y-4 border-b border-stone-200 pb-4">
            <p className="text-sm text-stone-600">Loading order summary...</p>
          </div>
          <div className="mt-4 space-y-3 text-stone-700">
            <div className="flex justify-between"><span>Subtotal</span><span>ETB {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>ETB 50</span></div>
            <div className="flex justify-between border-t border-stone-200 pt-3 font-bold text-oak"><span>Total</span><span>ETB {(subtotal + 50).toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
