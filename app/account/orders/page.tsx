'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/account/orders')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setOrders(data.orders)
      setLoading(false)
    }
    fetchOrders()
  }, [router])

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-16 text-center">Loading orders...</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-oak mb-8">My orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-lg text-stone-600">No orders yet.</p>
          <Link href="/menu" className="mt-4 inline-flex rounded-full bg-coffee-700 px-5 py-2 font-medium text-white">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-stone-50 text-sm uppercase text-stone-600 border-b border-stone-200">
              <tr>
                <th className="px-6 py-3">Order #</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-stone-200 hover:bg-stone-50">
                  <td className="px-6 py-3 font-medium text-oak">#{order.orderNumber}</td>
                  <td className="px-6 py-3 text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 font-semibold text-oak">ETB {order.total.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-coffee-700 font-medium"><a href={`/order/${order.orderNumber}`}>View</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
