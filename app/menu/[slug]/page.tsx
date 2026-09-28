import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function MenuDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, images: true },
  })

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-oak">Product not found</h1>
        <Link href="/menu" className="mt-4 inline-flex rounded-full bg-coffee-700 px-5 py-2 font-medium text-white">
          Back to menu
        </Link>
      </div>
    )
  }

  const price = product.discountPrice ?? product.price

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href="/menu" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-coffee-700">
        ← Back to menu
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-3 shadow-soft">
          <img
            src={product.mainImage ?? 'https://images.unsplash.com/photo-1498804103079-a6351b050096'}
            alt={product.name}
            className="h-[500px] w-full rounded-[1.5rem] object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coffee-700">{product.category.name}</p>
            <h1 className="mt-3 text-4xl font-bold text-oak">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3 text-lg font-semibold text-oak">
            <span>ETB {price.toFixed(2)}</span>
            {product.discountPrice && product.discountPrice < product.price ? (
              <span className="text-sm text-stone-500 line-through">ETB {product.price.toFixed(2)}</span>
            ) : null}
          </div>

          <p className="text-stone-700">{product.description}</p>

          <form action="/api/cart" method="POST" className="flex gap-3">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value="1" />
            <button className="rounded-full bg-coffee-700 px-6 py-3 font-medium text-white transition hover:bg-coffee-800">
              Add to cart
            </button>
          </form>

          {product.ingredients ? (
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
              <h3 className="text-lg font-semibold text-oak">Ingredients</h3>
              <p className="mt-2 text-stone-700">{product.ingredients}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
