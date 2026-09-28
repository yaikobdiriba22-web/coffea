import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product-card'

export default async function MenuPage() {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coffee-700">Our menu</p>
        <h1 className="mt-3 text-4xl font-bold text-oak">Explore everything we roast and bake.</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
