'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { createProduct } from '@/app/actions/productActions'
import { getShops } from '@/app/actions/shopActions'

export default function CreateProduct() {
  const [isLoading, setIsLoading] = useState(false)
  const [shops, setShops] = useState<{ id: string; name: string }[]>([])
  const router = useRouter()

  useState(() => {
    const fetchShops = async () => {
      const result = await getShops()
      if (result.shops) {
        setShops(result.shops.map(shop => ({ id: shop.id, name: shop.name })))
      }
    }
    fetchShops()
  }, )

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const shopId = formData.get('shopId') as string
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const stockLevel = parseInt(formData.get('stockLevel') as string, 10)
    const description = formData.get('description') as string

    try {
      const imageUrl = `/placeholder.svg?height=200&width=200`

      const result = await createProduct(shopId, name, price, stockLevel, description, imageUrl)

      setIsLoading(false)

      if (result) {
        toast({
          title: "Success",
          description: "Product created successfully",
        })
        router.push('/products')
      } else {
        throw new Error('Failed to create product')
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
      console.error('Error creating product:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopId">Shop</Label>
            <Select name="shopId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a shop" />
              </SelectTrigger>
              <SelectContent>
                {shops.map((shop) => (
                  <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockLevel">Stock Level</Label>
            <Input id="stockLevel" name="stockLevel" type="number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input id="image" name="image" type="file" accept="image/*" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

