'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CartItem {
  id: string
  product: { id: string; name: string; price: number; mainImage?: string }
  quantity: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch('/api/cart')
      const data = await res.json()
      setItems(data.items)
      setLoading(false)
    }
    fetchCart()
  }, [])

  const handleRemove = async (itemId: string) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
    setItems(items.filter(item => item.id !== itemId))
  }

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemove(itemId)
      return
    }
    const res = await fetch(`/api/cart/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })
    if (res.ok) {
      const updated = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
      setItems(updated)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-center">Loading cart...</div>
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-oak">Your cart</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-lg text-stone-600">Your cart is empty.</p>
          <Link href="/menu" className="mt-4 inline-flex rounded-full bg-coffee-700 px-5 py-2 font-medium text-white">
            Browse menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-oak">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <img src={item.product.mainImage ?? 'https://images.unsplash.com/photo-1498804103079-a6351b050096'} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
                <div>
                  <h3 className="font-semibold text-oak">{item.product.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="rounded-lg border border-stone-300 px-2 py-1 text-sm">-</button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="rounded-lg border border-stone-300 px-2 py-1 text-sm">+</button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="font-semibold text-oak">ETB {(item.product.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => handleRemove(item.id)} className="text-sm text-red-600 hover:text-red-700">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-oak">Summary</h2>
          <div className="mt-5 space-y-3 text-stone-700">
            <div className="flex justify-between"><span>Subtotal</span><span>ETB {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>ETB 0</span></div>
            <div className="flex justify-between border-t border-stone-200 pt-3 font-bold text-oak"><span>Total</span><span>ETB {subtotal.toFixed(2)}</span></div>
          </div>
          <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-coffee-700 px-5 py-3 font-medium text-white hover:bg-coffee-800">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
