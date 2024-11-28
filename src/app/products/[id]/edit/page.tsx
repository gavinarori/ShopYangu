'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getProductById, updateProduct } from '@/app/actions/productActions'
import { getShops } from '@/app/actions/shopActions'

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [shops, setShops] = useState<{ id: string; name: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProductAndShops = async () => {
      try {
        const productData = await getProductById(id)
        setProduct(productData)
        const shopsData = await getShops()
        setShops(shopsData.shops.map((shop: any) => ({ id: shop.id, name: shop.name })))
      } catch (error) {
        console.error('Error fetching product or shops:', error)
        toast({
          title: "Error",
          description: "Failed to fetch product or shops data. Please try again.",
          variant: "destructive",
        })
      }
    }
    fetchProductAndShops()
  }, [id])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const stockLevel = parseInt(formData.get('stockLevel') as string, 10)
    const description = formData.get('description') as string
    const shopId = formData.get('shopId') as string
    const imageFile = formData.get('image') as File

    try {
      // For this example, we'll use the existing image URL or a placeholder
      const imageUrl = product.image || `/placeholder.svg?height=200&width=200`

      const result = await updateProduct(id, name, price, stockLevel, description, imageUrl)

      setIsLoading(false)

      if (result) {
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
        router.push('/products')
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
      console.error('Error updating product:', error)
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" defaultValue={product.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockLevel">Stock Level</Label>
            <Input id="stockLevel" name="stockLevel" type="number" defaultValue={product.stockLevel} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={product.description} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shopId">Shop</Label>
            <Select name="shopId" defaultValue={product.shopId}>
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
            <Label htmlFor="image">Product Image</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

