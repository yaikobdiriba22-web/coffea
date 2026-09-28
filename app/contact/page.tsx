'use client'

import { useState, FormEvent } from 'react'
import { Metadata } from 'next'

const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Coffea team.',
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setMessage('Thank you! We'll get back to you soon.')
        e.currentTarget.reset()
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error(error)
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-oak">Get in touch</h1>
        <p className="mt-4 text-lg text-stone-600">Have a question? We'd love to hear from you.</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-oak">Name</label>
            <input
              type="text"
              name="name"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Phone</label>
            <input
              type="tel"
              name="phone"
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Subject</label>
            <input
              type="text"
              name="subject"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Message</label>
            <textarea
              name="message"
              required
              rows={6}
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-coffee-700 px-6 py-3 font-medium text-white transition hover:bg-coffee-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
          {message && <p className="text-center text-sm text-coffee-700 font-medium">{message}</p>}
        </form>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-oak">Location</h3>
            <p className="mt-2 text-stone-600">Addis Ababa, Ethiopia</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-oak">Phone</h3>
            <p className="mt-2 text-stone-600">+251 911 123 456</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-oak">Email</h3>
            <p className="mt-2 text-stone-600">hello@coffea.local</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-oak">Hours</h3>
            <ul className="mt-2 space-y-1 text-stone-600">
              <li>Mon - Fri: 6:30 AM - 8:00 PM</li>
              <li>Sat: 8:00 AM - 8:00 PM</li>
              <li>Sun: 9:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
