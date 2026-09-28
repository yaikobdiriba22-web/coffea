import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@coffea.local'
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456'

  const categories = [
    { name: 'Espresso', slug: 'espresso', description: 'High-intensity shots', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348' },
    { name: 'Cappuccino', slug: 'cappuccino', description: 'Espresso with milk foam', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096' },
    { name: 'Latte', slug: 'latte', description: 'Creamy espresso with steamed milk', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93' },
    { name: 'Americano', slug: 'americano', description: 'Espresso with hot water', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e' },
    { name: 'Mocha', slug: 'mocha', description: 'Espresso, chocolate and milk', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31' },
    { name: 'Cold Coffee', slug: 'cold-coffee', description: 'Smooth cold drinks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735' },
    { name: 'Tea', slug: 'tea', description: 'Herbal and black tea selections', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
    { name: 'Pastries', slug: 'pastries', description: 'Freshly baked pastries', image: 'https://images.unsplash.com/photo-1509440159596-024ec1e45c5c' },
    { name: 'Desserts', slug: 'desserts', description: 'Sweet treats', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b' },
  ]

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        name: 'Coffea Admin',
        role: 'ADMIN',
      },
    })
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  const espresso = await prisma.category.findUnique({ where: { slug: 'espresso' } })
  const latte = await prisma.category.findUnique({ where: { slug: 'latte' } })
  const mocha = await prisma.category.findUnique({ where: { slug: 'mocha' } })
  const coldCoffee = await prisma.category.findUnique({ where: { slug: 'cold-coffee' } })

  const products = [
    { name: 'Ethiopian Sunrise', slug: 'ethiopian-sunrise', description: 'Floral and citrus notes with a bright finish.', price: 230, discountPrice: 210, categoryId: espresso!.id, mainImage: 'https://images.unsplash.com/photo-1498804103079-a6351b050096', preparationTime: 5, ingredients: 'Arabica beans, water', isFeatured: true, isPopular: true, isAvailable: true },
    { name: 'Hazelnut Latte', slug: 'hazelnut-latte', description: 'Smooth espresso layered with hazelnut cream.', price: 280, discountPrice: 260, categoryId: latte!.id, mainImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93', preparationTime: 8, ingredients: 'Espresso, milk, hazelnut syrup', isFeatured: true, isPopular: true, isAvailable: true },
    { name: 'Dark Mocha', slug: 'dark-mocha', description: 'Rich espresso with dark chocolate notes.', price: 300, discountPrice: 280, categoryId: mocha!.id, mainImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31', preparationTime: 8, ingredients: 'Espresso, cocoa, milk', isFeatured: true, isPopular: true, isAvailable: true },
    { name: 'Iced Latte', slug: 'iced-latte', description: 'Cold espresso with chilled milk and ice.', price: 260, categoryId: coldCoffee!.id, mainImage: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', preparationTime: 6, ingredients: 'Espresso, milk, ice', isFeatured: false, isPopular: true, isAvailable: true },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('Seed completed successfully.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
