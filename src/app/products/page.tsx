'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProducts, deleteProduct } from '@/app/actions/productActions'
import { getShops } from '@/app/actions/shopActions'
import { toast } from "@/hooks/use-toast"

export default function AllProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [shops, setShops] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    shopId: 'all',
  })

  useEffect(() => {
    fetchProducts()
    fetchShops()
  }, [currentPage, search, filters])

  async function fetchShops() {
    try {
      const result = await getShops()
      setShops(result.shops)
    } catch (error) {
      console.error('Error fetching shops:', error)
      toast({
        title: "Error",
        description: "Failed to fetch shops. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function fetchProducts() {
    setIsLoading(true)
    try {
      const result = await getProducts(
        currentPage, 
        10, 
        search, 
        Number(filters.minPrice) || undefined,
        Number(filters.maxPrice) || undefined,
        Number(filters.minStock) || undefined,
        Number(filters.maxStock) || undefined,
        filters.shopId === 'all' ? undefined : filters.shopId
      )
      setProducts(result.products)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>All Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button asChild>
              <Link href="/products/create">Create New Product</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Input
              placeholder="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            />
            <Input
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />
            <Input
              placeholder="Min Stock"
              type="number"
              value={filters.minStock}
              onChange={(e) => setFilters({...filters, minStock: e.target.value})}
            />
            <Input
              placeholder="Max Stock"
              type="number"
              value={filters.maxStock}
              onChange={(e) => setFilters({...filters, maxStock: e.target.value})}
            />
          </div>
          <Select 
            value={filters.shopId} 
            onValueChange={(value) => setFilters({...filters, shopId: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Shop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shops</SelectItem>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stockLevel}</TableCell>
                <TableCell>{product.shop.name}</TableCell>
                <TableCell>
                  <Button asChild size="sm" className="mr-2">
                    <Link href={`/products/${product.id}/edit`}>Edit</Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

