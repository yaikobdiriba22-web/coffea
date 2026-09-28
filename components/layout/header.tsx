'use client'

import Link from 'next/link'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch('/api/cart')
        const data = await res.json()
        setCartCount(data.count || 0)
      } catch (error) {
        console.error('Failed to fetch cart count:', error)
      }
    }
    fetchCartCount()
  }, [])

  const navItems = [
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black text-coffee-700">
          ☕ Coffea
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium transition ${
                isActive(item.href)
                  ? 'text-coffee-700 border-b-2 border-coffee-700 pb-2'
                  : 'text-stone-700 hover:text-coffee-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-flex rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Log in
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex rounded-full bg-coffee-100 p-3 text-coffee-700 transition hover:bg-coffee-200"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-full p-2 text-stone-700 hover:bg-stone-100"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-stone-200 bg-white p-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-3 font-medium text-stone-700 hover:text-coffee-700"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
