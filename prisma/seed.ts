import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@coffea.et',
      password: adminPassword,
      name: 'Admin User',
      phone: '+251911223344',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 12)
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Test Customer',
      phone: '+251911555555',
      role: 'CUSTOMER',
    },
  })
  console.log('✅ Customer created:', customer.email)

  // Create categories
  const espresso = await prisma.category.create({
    data: {
      name: 'Espresso',
      slug: 'espresso',
      description: 'Rich, concentrated coffee beverages',
      image: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445',
    },
  })

  const pastries = await prisma.category.create({
    data: {
      name: 'Pastries',
      slug: 'pastries',
      description: 'Fresh-baked pastries and desserts',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    },
  })

  const cold = await prisma.category.create({
    data: {
      name: 'Cold Brew',
      slug: 'cold-brew',
      description: 'Smooth, cold coffee drinks',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    },
  })

  console.log('✅ Categories created')

  // Create products
  const products = [
    {
      name: 'Espresso',
      slug: 'espresso-single',
      description: 'Single shot of rich, concentrated espresso',
      price: 80,
      categoryId: espresso.id,
      mainImage: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445',
      ingredients: 'Premium Ethiopian coffee beans',
      isAvailable: true,
    },
    {
      name: 'Cappuccino',
      slug: 'cappuccino',
      description: 'Espresso with steamed milk and foam',
      price: 120,
      categoryId: espresso.id,
      mainImage: 'https://images.unsplash.com/photo-1511537190424-71f4c27d12ab',
      ingredients: 'Ethiopian espresso, milk, foam',
      isAvailable: true,
    },
    {
      name: 'Latte',
      slug: 'latte',
      description: 'Creamy espresso with steamed milk',
      price: 130,
      categoryId: espresso.id,
      mainImage: 'https://images.unsplash.com/photo-1505778276668-fc5ee3f8e3f7',
      ingredients: 'Ethiopian espresso, milk',
      isAvailable: true,
    },
    {
      name: 'Croissant',
      slug: 'croissant',
      description: 'Buttery, flaky French pastry',
      price: 90,
      categoryId: pastries.id,
      mainImage: 'https://images.unsplash.com/photo-1535920527894-b82b27c22ce8',
      ingredients: 'Butter, flour, salt, sugar',
      isAvailable: true,
    },
    {
      name: 'Chocolate Cake',
      slug: 'chocolate-cake',
      description: 'Rich, moist chocolate cake',
      price: 150,
      discountPrice: 120,
      categoryId: pastries.id,
      mainImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
      ingredients: 'Chocolate, eggs, flour, sugar, butter',
      isAvailable: true,
    },
    {
      name: 'Cold Brew Coffee',
      slug: 'cold-brew-coffee',
      description: 'Smooth and refreshing cold brew',
      price: 110,
      categoryId: cold.id,
      mainImage: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
      ingredients: 'Ethiopian coffee beans, water',
      isAvailable: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log('✅ Products created')

  // Create sample order
  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      userId: customer.id,
      customerName: 'Test Customer',
      customerEmail: customer.email,
      customerPhone: customer.phone || '',
      orderType: 'PICKUP',
      subtotal: 200,
      deliveryFee: 0,
      total: 200,
      status: 'CONFIRMED',
      paymentMethod: 'CASH_PICKUP',
      paymentStatus: 'PENDING',
    },
  })

  console.log('✅ Sample order created')

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
