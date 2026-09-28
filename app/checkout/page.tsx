import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CartPage() {
  const cart = await prisma.cart.findUnique({
    where: { userId: 'guest-user' },
    include: { items: { include: { product: true } } },
  })

  const items = cart?.items ?? []
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-oak">Your cart</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-lg text-stone-600">Your cart is empty.</p>
          <Link href="/menu" className="mt-4 inline-flex rounded-full bg-coffee-700 px-5 py-2 font-medium text-white">
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex items-center gap-4">
                  <img src={item.product.mainImage ?? 'https://images.unsplash.com/photo-1498804103079-a6351b050096'} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-semibold text-oak">{item.product.name}</h3>
                    <p className="text-sm text-stone-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-semibold text-oak">{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(item.product.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-oak">Summary</h2>
            <div className="mt-5 space-y-3 text-stone-700">
              <div className="flex justify-between"><span>Subtotal</span><span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>ETB 0</span></div>
              <div className="flex justify-between border-t border-stone-200 pt-3 font-bold text-oak"><span>Total</span><span>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(subtotal)}</span></div>
            </div>
            <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-coffee-700 px-5 py-3 font-medium text-white hover:bg-coffee-800">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
