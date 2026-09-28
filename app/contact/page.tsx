'use client'

import { FormEvent, useState } from 'react'
import { Metadata } from 'next'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const body = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
        return
      }

      setSuccess(true)
      e.currentTarget.reset()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-oak">Get in touch</h1>
        <p className="mt-4 text-lg text-stone-600">
          Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-oak">Full name *</label>
            <input
              type="text"
              name="name"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Email *</label>
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
            <label className="block text-sm font-medium text-oak">Subject *</label>
            <input
              type="text"
              name="subject"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oak">Message *</label>
            <textarea
              name="message"
              required
              rows={5}
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coffee-700"
            />
          </div>
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          {success && <p className="text-sm text-green-600 font-medium">Message sent! We'll get back to you soon.</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-coffee-700 px-4 py-2 font-medium text-white transition hover:bg-coffee-800 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send message'}
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-oak">Hours</h3>
            <div className="mt-4 space-y-2 text-stone-700">
              <div className="flex justify-between"><span>Monday - Friday</span><span>7:00 AM - 8:00 PM</span></div>
              <div className="flex justify-between"><span>Saturday</span><span>8:00 AM - 9:00 PM</span></div>
              <div className="flex justify-between"><span>Sunday</span><span>8:00 AM - 7:00 PM</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-oak">Location</h3>
            <p className="mt-4 text-stone-700">
              Coffea Coffee House<br />
              123 Main Street<br />
              Addis Ababa, Ethiopia<br />
              <br />
              <strong>Phone:</strong> +251 911 223344<br />
              <strong>Email:</strong> hello@coffea.et
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
