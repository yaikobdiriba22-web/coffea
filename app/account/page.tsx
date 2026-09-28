import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CheckoutPage() {
  const cart = await prisma.cart.findUnique({
    where: { userId: 'guest-user' },
    include: { items: { include: { product: true } } },
  })

  const items = cart?.items ?? []
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-oak">Checkout</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-lg text-stone-600">Your cart is empty.</p>
          <Link href="/menu" className="mt-4 inline-flex rounded-full bg-coffee-700 px-5 py-2 font-medium text-white">
            Explore menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-oak">Full name</label>
              <input name="name" required className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-oak">Email</label>
                <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-oak">Phone</label>
                <input name="phone" required className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-oak">Order type</label>
              <select name="orderType" className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2">
                <option value="PICKUP">Pickup</option>
                <option value="DELIVERY">Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-oak">Delivery address</label>
              <textarea name="address" rows={3} className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2" />
            </div>
            <button type="submit" className="w-full rounded-full bg-coffee-700 px-5 py-3 font-medium text-white transition hover:bg-coffee-800">
              Place order
            </button>
          </form>

          <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-oak">Order summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm text-stone-700">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-stone-200 pt-4 text-stone-700">
              <div className="flex justify-between"><span>Subtotal</span><span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>ETB 50</span></div>
              <div className="flex justify-between font-bold text-oak"><span>Total</span><span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(subtotal + 50)}</span></div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
