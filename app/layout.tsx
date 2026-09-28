import './globals.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s | Coffea',
    default: 'Coffea | Coffee, pastries & community',
  },
  description: 'Coffea is a modern coffee house serving artisan coffee, fresh pastries, dessert, and community-driven experiences.',
  openGraph: {
    title: 'Coffea',
    description: 'Fresh coffee, espresso, pastries and community.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} bg-[#f8f4f0] text-[#2a1d1b] antialiased`}>
        <div className="min-h-screen">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
