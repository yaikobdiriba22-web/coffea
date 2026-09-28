'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { getProductPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  discountPrice?: number | null
  mainImage?: string | null
  category: { name: string }
}

export default function ProductCard({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false)
  const price = getProductPrice(product)

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })
      if (res.ok) {
        alert('Added to cart!')
        // Refresh cart count in header
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/menu/${product.slug}`}>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-soft">
          <div className="relative h-56 w-full overflow-hidden bg-stone-100">
            <img
              src={product.mainImage ?? 'https://images.unsplash.com/photo-1498804103079-a6351b050096'}
              alt={product.name}
              className="h-full w-full object-cover transition group-hover:scale-110"
            />
            {product.discountPrice && product.discountPrice < product.price && (
              <div className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold uppercase text-coffee-700">{product.category.name}</p>
            <h3 className="mt-2 font-semibold text-oak line-clamp-2">{product.name}</h3>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-lg text-oak">
                  {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(price)}
                </span>
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="text-xs text-stone-400 line-through">
                    {new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(product.price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="mt-3 w-full rounded-full bg-coffee-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-coffee-800 disabled:opacity-50"
      >
        <ShoppingCart className="h-4 w-4 inline mr-2" />
        {isAdding ? 'Adding...' : 'Add to cart'}
      </button>
    </motion.div>
  )
}
