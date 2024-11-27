'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getShops, deleteShop } from '@/app/actions/shopActions'
import { toast } from "@/hooks/use-toast"

export default function AllShops() {
  const [shops, setShops] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchShops()
  }, [currentPage,])

  async function fetchShops() {
    setIsLoading(true)
    try {
      const result = await getShops(currentPage, 10,)
      setShops(result.shops)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error fetching shops:', error)
      toast({
        title: "Error",
        description: "Failed to fetch shops. Please try again.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this shop? This action cannot be undone.')) {
      try {
        await deleteShop(id)
        toast({
          title: "Success",
          description: "Shop deleted successfully",
        })
        fetchShops()
      } catch (error) {
        console.error('Error deleting shop:', error)
        toast({
          title: "Error",
          description: "Failed to delete shop. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>All Shops</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Button asChild>
            <Link href="/shops/create">Create New Shop</Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell>
                  <Image src={shop.logo} alt={`${shop.name} logo`} width={50} height={50} />
                </TableCell>
                <TableCell>{shop.name}</TableCell>
                <TableCell>{shop.description}</TableCell>
                <TableCell>
                  <Button asChild size="sm" className="mr-2">
                    <Link href={`/shops/${shop.id}/edit`}>Edit</Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(shop.id)}>
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

