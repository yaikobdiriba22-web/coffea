import { prisma } from '@/lib/prisma'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-oak">Products</h1>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-stone-50 text-sm uppercase text-stone-600">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-stone-200">
                <td className="px-4 py-3 font-medium text-oak">{product.name}</td>
                <td className="px-4 py-3 text-stone-600">{product.category.name}</td>
                <td className="px-4 py-3 text-stone-600">ETB {product.price}</td>
                <td className="px-4 py-3 text-stone-600">{product.isAvailable ? 'Available' : 'Unavailable'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
