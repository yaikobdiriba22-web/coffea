import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-green-200 bg-green-50 p-10 shadow-sm">
        <h1 className="text-4xl font-bold text-green-800">Order placed successfully!</h1>
        <p className="mt-4 text-stone-700">Thanks for choosing Coffea. Your order has been received and we’ll prepare it shortly.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/menu" className="rounded-full bg-coffee-700 px-6 py-3 font-medium text-white hover:bg-coffee-800">
            Continue shopping
          </Link>
          <Link href="/account/orders" className="rounded-full border border-stone-300 bg-white px-6 py-3 font-medium text-oak hover:border-stone-400">
            View orders
          </Link>
        </div>
      </div>
    </div>
  )
}
