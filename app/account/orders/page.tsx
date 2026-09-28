import Link from 'next/link'

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-oak">My account</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { title: 'Profile', href: '/account', description: 'Manage your personal details' },
          { title: 'Orders', href: '/account/orders', description: 'View your order history' },
          { title: 'Saved address', href: '/account', description: 'Update delivery information' },
        ].map((item) => (
          <Link key={item.title} href={item.href} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-oak">{item.title}</h2>
            <p className="mt-2 text-stone-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
