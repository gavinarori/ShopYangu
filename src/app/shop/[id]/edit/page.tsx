'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { getShopById, updateShop } from '@/app/actions/shopActions'

export default function EditShop({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [isLoading, setIsLoading] = useState(false)
    const [shop, setShop] = useState<any>(null)
    const router = useRouter()
  
    useEffect(() => {
      const fetchShop = async () => {
        try {
          const shopData = await getShopById(id)
          setShop(shopData)
        } catch (error) {
          console.error('Error fetching shop:', error)
          toast({
            title: "Error",
            description: "Failed to fetch shop data. Please try again.",
            variant: "destructive",
          })
        }
      }
      fetchShop()
    }, [id])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const logoFile = formData.get('logo') as File

    try {
      // For this example, we'll use the existing logo URL or a placeholder
      const logoUrl = shop.logo || `/placeholder.svg?height=100&width=100`

      const result = await updateShop(id, name, description, logoUrl)

      setIsLoading(false)

      if (result) {
        toast({
          title: "Success",
          description: "Shop updated successfully",
        })
        router.push('/shop')
      } else {
        throw new Error('Failed to update shop')
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to update shop. Please try again.",
        variant: "destructive",
      })
      console.error('Error updating shop:', error)
    }
  }

  if (!shop) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Edit Shop</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Shop Name</Label>
            <Input id="name" name="name" defaultValue={shop.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Shop Description</Label>
            <Textarea id="description" name="description" defaultValue={shop.description} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Shop Logo</Label>
            <Input id="logo" name="logo" type="file" accept="image/*" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Shop'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

