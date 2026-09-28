'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Package, Users, ShoppingCart, MessageSquare } from 'lucide-react'

interface DashboardStats {
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  pendingOrders: number
  totalRevenue: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (!res.ok) {
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-center">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-oak">Coffea Admin</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 font-medium text-stone-700 hover:bg-stone-50"
            >
              <LogOut size={18} /> Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-2">
            <Link href="/admin/dashboard" className="block rounded-lg bg-coffee-100 px-4 py-2 font-medium text-coffee-700">
              Dashboard
            </Link>
            <Link href="/admin/products" className="block rounded-lg px-4 py-2 font-medium text-stone-700 hover:bg-stone-100">
              Products
            </Link>
            <Link href="/admin/categories" className="block rounded-lg px-4 py-2 font-medium text-stone-700 hover:bg-stone-100">
              Categories
            </Link>
            <Link href="/admin/orders" className="block rounded-lg px-4 py-2 font-medium text-stone-700 hover:bg-stone-100">
              Orders
            </Link>
            <Link href="/admin/customers" className="block rounded-lg px-4 py-2 font-medium text-stone-700 hover:bg-stone-100">
              Customers
            </Link>
            <Link href="/admin/contacts" className="block rounded-lg px-4 py-2 font-medium text-stone-700 hover:bg-stone-100">
              Contact Messages
            </Link>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Stats Grid */}
            {stats && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-stone-600">Total Orders</p>
                  <p className="mt-2 text-3xl font-bold text-oak">{stats.totalOrders}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-stone-600">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-stone-600">Customers</p>
                  <p className="mt-2 text-3xl font-bold text-oak">{stats.totalCustomers}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-stone-600">Products</p>
                  <p className="mt-2 text-3xl font-bold text-oak">{stats.totalProducts}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-stone-600">Revenue</p>
                  <p className="mt-2 text-2xl font-bold text-green-700">ETB {(stats.totalRevenue / 1000).toFixed(1)}K</p>
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-200 px-6 py-4">
                <h2 className="text-xl font-bold text-oak">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-600">
                    <tr>
                      <th className="px-6 py-3">Order #</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-stone-200 hover:bg-stone-50">
                        <td className="px-6 py-3 font-medium text-oak">#{order.orderNumber}</td>
                        <td className="px-6 py-3 text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-3 font-semibold text-oak">ETB {order.total.toFixed(2)}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-coffee-700 font-medium">
                          <Link href={`/admin/orders/${order.id}`}>Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
