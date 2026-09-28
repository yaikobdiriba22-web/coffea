'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      fetch(`/api/orders/${orderNumber}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data.order)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [orderNumber])

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-green-200 bg-green-50 p-10 shadow-sm">
        <div className="text-6xl font-bold text-green-600 mb-4">✓</div>
        <h1 className="text-4xl font-bold text-green-800">Order placed successfully!</h1>
        <p className="mt-4 text-stone-700">Thanks for choosing Coffea. Your order has been received and we'll prepare it shortly.</p>
        
        {loading ? (
          <p className="mt-6 text-stone-600">Loading order details...</p>
        ) : order ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 text-left">
            <h2 className="font-semibold text-oak mb-4">Order Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-stone-600">Order number:</span><span className="font-semibold text-oak">#{order.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Customer:</span><span className="font-semibold text-oak">{order.customerName}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Type:</span><span className="font-semibold text-oak">{order.orderType === 'PICKUP' ? 'Pickup' : 'Delivery'}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Total:</span><span className="font-bold text-oak">ETB {order.total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Status:</span><span className="font-semibold text-orange-600">{order.status}</span></div>
            </div>
          </div>
        ) : null}
        
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/menu" className="rounded-full bg-coffee-700 px-6 py-3 font-medium text-white hover:bg-coffee-800">
            Continue shopping
          </Link>
          <Link href="/" className="rounded-full border border-stone-300 bg-white px-6 py-3 font-medium text-oak hover:border-stone-400">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
