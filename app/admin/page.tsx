import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeSession } from '@/lib/auth'

export default async function AdminPage() {
  const session = decodeSession(cookies().get('coffea_session')?.value)

  if (!session || session.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const [totalSales, totalOrders, totalCustomers, pendingOrders, completedOrders] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-oak">Admin dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total sales', value: `ETB ${totalSales._sum.total ?? 0}` },
          { label: 'Total orders', value: totalOrders },
          { label: 'Customers', value: totalCustomers },
          { label: 'Pending', value: pendingOrders },
          { label: 'Completed', value: completedOrders },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-oak">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
