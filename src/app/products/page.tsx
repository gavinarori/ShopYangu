'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts, deleteProduct } from '@/app/actions/productActions'
import { toast } from "@/hooks/use-toast"

export default function AllProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, search])

  async function fetchProducts() {
    setIsLoading(true)
    try {
      const result = await getProducts(currentPage, 10, search)
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>All Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
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

