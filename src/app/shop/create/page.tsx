'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { createShop } from '@/app/actions/shopActions'
import { uploadFile } from '@/app/actions/uploadFile'

export default function CreateShop() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const logoFile = formData.get('logo') as File

    try {
      const logoUrl = await uploadFile(logoFile)
      const result = await createShop(name, description, logoUrl)
      setIsLoading(false)
      if (result) {
        toast({
          title: "Success",
          description: "Shop created successfully",
        })
        router.push('/')
      } else {
        throw new Error('Failed to create shop')
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to create shop. Please try again.",
        variant: "destructive",
      })
      console.error('Error creating shop:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Create New Shop</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Shop Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Shop Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Shop Logo</Label>
            <Input id="logo" name="logo" type="file" accept="image/*" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Shop'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

