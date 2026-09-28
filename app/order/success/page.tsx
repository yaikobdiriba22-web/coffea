import { prisma } from '@/lib/prisma'

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-oak">Order history</h1>
      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-stone-50 text-sm uppercase text-stone-600">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-stone-200">
                <td className="px-4 py-3 font-medium text-oak">#{order.orderNumber}</td>
                <td className="px-4 py-3 text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-stone-600">{order.status}</td>
                <td className="px-4 py-3 font-semibold text-oak">{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
