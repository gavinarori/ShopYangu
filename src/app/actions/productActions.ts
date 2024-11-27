'use server'

import { prisma } from '@/lib/db'

export async function createProduct(
  shopId: string,
  name: string,
  price: number,
  stockLevel: number,
  description: string,
  image: string
) {
  return prisma.product.create({
    data: {
      name,
      price,
      stockLevel,
      description,
      image,
      shopId,
    },
  })
}

export async function updateProduct(
  id: string,
  name: string,
  price: number,
  stockLevel: number,
  description: string,
  image: string
) {
  return prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      stockLevel,
      description,
      image,
    },
  })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  })
}

export async function getProducts(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  minPrice?: number,
  maxPrice?: number,
  minStock?: number,
  maxStock?: number,
  shopId?: string,
  sortBy: 'name' | 'price' | 'stockLevel' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (search) {
    where.name = { contains: search, mode: 'insensitive' }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  if (minStock !== undefined || maxStock !== undefined) {
    where.stockLevel = {}
    if (minStock !== undefined) where.stockLevel.gte = minStock
    if (maxStock !== undefined) where.stockLevel.lte = maxStock
  }

  if (shopId) {
    where.shopId = shopId
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      include: { shop: true },
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
    pageSize,
  }
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { shop: true },
  })
}

