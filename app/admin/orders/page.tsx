import { prisma } from '@/lib/prisma'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-oak">Orders</h1>
      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-stone-50 text-sm uppercase text-stone-600">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-stone-200">
                <td className="px-4 py-3 font-medium text-oak">#{order.orderNumber}</td>
                <td className="px-4 py-3 text-stone-600">{order.customerName}</td>
                <td className="px-4 py-3 text-stone-600">{order.status}</td>
                <td className="px-4 py-3 text-stone-600">ETB {order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
