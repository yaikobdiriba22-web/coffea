import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Coffea',
  description: 'Learn about our story, mission, and commitment to quality coffee.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-oak">Our story</h1>
        <p className="mt-4 text-lg text-stone-600">
          Founded in the heart of Addis Ababa, Coffea is more than a coffee shop—it's a gathering place for people who value quality, craftsmanship, and community.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-oak">Our mission</h2>
          <p className="mt-4 text-stone-700">
            To serve exceptional, ethically sourced coffee and pastries in an environment where customers feel welcomed, valued, and part of something meaningful. We believe great coffee brings people together.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-oak">Why Coffea?</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Single-origin excellence',
                text: 'We source beans directly from Ethiopian farmers, ensuring fair prices and quality control from harvest to cup.',
              },
              {
                title: 'Fresh-baked daily',
                text: 'Our pastries and desserts are made fresh each morning with quality butter, eggs, fruit, and seasonal ingredients.',
              },
              {
                title: 'Community first',
                text: 'Coffea is a workspace for creatives, a meeting point for friends, and a retreat from the busy world.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="font-semibold text-oak text-lg">{item.title}</h3>
                <p className="mt-3 text-stone-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-coffee-50 p-8">
          <h2 className="text-2xl font-bold text-oak">Sustainability</h2>
          <p className="mt-4 text-stone-700">
            We're committed to sustainable practices. All our packaging is compostable or recyclable, and we work directly with Ethiopian coffee farmers to ensure fair wages and responsible land management.
          </p>
        </section>
      </div>
    </div>
  )
}
