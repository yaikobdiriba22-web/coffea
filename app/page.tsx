import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Coffee, Sparkles } from 'lucide-react'
import ProductCard from '@/components/product-card'

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isAvailable: true },
    include: { category: true },
    take: 4,
  })

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-coffee-200 bg-white/80 px-3 py-1 text-sm text-coffee-700">
              <Sparkles className="h-4 w-4" />
              Ethically roasted daily
            </div>
            <h1 className="max-w-xl text-5xl font-black tracking-tight text-oak md:text-6xl">
              Fresh coffee in every sip.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-stone-700">
              Small-batch beans, handcrafted espresso, and warm pastries made to bring people together.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/menu" className="inline-flex items-center gap-2 rounded-full bg-coffee-700 px-6 py-3 font-medium text-white shadow-soft transition hover:bg-coffee-800">
                Explore menu
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className="inline-flex items-center rounded-full border border-stone-300 bg-white px-6 py-3 font-medium text-oak transition hover:border-coffee-400">
                Our story
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-coffee-100 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white p-4 shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80"
                alt="Coffea coffee bar"
                className="h-[560px] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: 'Specialty beans', text: 'Single-origin coffee sourced responsibly, roasted for depth and clarity.' },
            { title: 'Fresh bakery', text: 'Baked daily with butter, fruit, and seasonal ingredients.' },
            { title: 'Warm hospitality', text: 'A community-first café experience from morning rush to late afternoon.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <Coffee className="mb-4 h-7 w-7 text-coffee-700" />
              <h3 className="text-xl font-semibold text-oak">{item.title}</h3>
              <p className="mt-3 text-stone-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coffee-700">Featured drinks</p>
            <h2 className="mt-2 text-3xl font-bold text-oak">Popular favorites</h2>
          </div>
          <Link href="/menu" className="text-sm font-semibold text-coffee-700">View all</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-[#201712] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coffee-200">About the café</p>
            <h2 className="mt-3 text-3xl font-bold">Crafted for slow mornings and meaningful meetings.</h2>
            <p className="mt-5 max-w-xl text-stone-300">
              Coffea was built to serve people who care about quality, comfort, and connection. Every roast, pastry, and cup is designed to make your day a little better.
            </p>
            <Link href="/about" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-medium text-oak transition hover:bg-coffee-100">
              Learn more
            </Link>
          </div>
          <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-soft">
            <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80" alt="Cafe interior" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </>
  )
}
