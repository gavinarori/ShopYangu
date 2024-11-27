import { prisma } from '@/lib/db'

export async function createShop(name: string, description: string, logo: string) {
  return prisma.shop.create({
    data: {
      name,
      description,
      logo,
    },
  })
}

export async function updateShop(id: string, name: string, description: string, logo: string) {
  return prisma.shop.update({
    where: { id },
    data: {
      name,
      description,
      logo,
    },
  })
}

export async function deleteShop(id: string) {
  const shop = await prisma.shop.findUnique({
    where: { id },
    include: { products: true },
  })

  if (shop && shop.products.length > 0) {
    throw new Error('Cannot delete shop with active products')
  }

  return prisma.shop.delete({
    where: { id },
  })
}

export async function getShops(page: number = 1, pageSize: number = 10,) {
  const skip = (page - 1) * pageSize
  const [shops, total] = await Promise.all([
    prisma.shop.findMany({
      skip,
      take: pageSize,
      include: { products: true },
    }),
    prisma.shop.count(),
  ])

  return {
    shops,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getShopById(id: string) {
  return prisma.shop.findUnique({
    where: { id },
    include: { products: true },
  })
}

