import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200 bg-oak text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold">☕ Coffea</h3>
            <p className="mt-3 text-stone-300">
              Ethically roasted coffee, fresh pastries, and warm hospitality.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-stone-300">
              <li>
                <Link href="/menu" className="hover:text-white">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Account</h4>
            <ul className="mt-3 space-y-2 text-stone-300">
              <li>
                <Link href="/login" className="hover:text-white">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-3 space-y-3 text-stone-300">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +251 911 123 456
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@coffea.local
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-700 pt-8 text-center text-sm text-stone-400">
          <p>&copy; {year} Coffea Café. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
