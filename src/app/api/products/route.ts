import { NextResponse } from 'next/server'
import { getProducts } from '@/app/actions/productActions'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
  const search = searchParams.get('search') || undefined
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
  const minStock = searchParams.get('minStock') ? parseInt(searchParams.get('minStock')!, 10) : undefined
  const maxStock = searchParams.get('maxStock') ? parseInt(searchParams.get('maxStock')!, 10) : undefined
  const shopId = searchParams.get('shopId') || undefined
  const sortBy = (searchParams.get('sortBy') as 'name' | 'price' | 'stockLevel') || 'name'
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'

  try {
    const result = await getProducts(
      page,
      pageSize,
      search,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      shopId,
      sortBy,
      sortOrder
    )
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

