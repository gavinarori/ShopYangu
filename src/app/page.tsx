'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getShops } from '@/app/actions/shopActions'
import { getProducts } from '@/app/actions/productActions'
import { ShoppingBag, Package, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation"
import { StockStatusDistribution } from '@/components/stock-status-distribution'
import { TopShopsByStock } from '@/components/top-shops-by-stock'

export default function Home() {
  const [shopCount, setShopCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [stockStatus, setStockStatus] = useState({ inStock: 0, outOfStock: 0, lowStock: 0 })
  const [topShops, setTopShops] = useState([])
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  useEffect(() => {
    async function fetchData() {
      const shopsResult = await getShops(1, 1000)  
      setShopCount(shopsResult.total)

      const productsResult = await getProducts(1, 1000)  
      setProductCount(productsResult.total)

      const inStock = productsResult.products.filter(p => p.stockLevel > 5).length
      const outOfStock = productsResult.products.filter(p => p.stockLevel === 0).length
      const lowStock = productsResult.products.filter(p => p.stockLevel > 0 && p.stockLevel <= 5).length
      setStockStatus({ inStock, outOfStock, lowStock })

      const shopStocks = shopsResult.shops.map(shop => ({
        name: shop.name,
        stockCount: shop.products.reduce((total, product) => total + product.stockLevel, 0)
      }))
      const sortedShops:any = shopStocks.sort((a, b) => b.stockCount - a.stockCount).slice(0, 5)
      setTopShops(sortedShops)
    }
    fetchData()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Shops
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopCount}</div>
                <p className="text-xs text-muted-foreground">
                  Across all locations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount}</div>
                <p className="text-xs text-muted-foreground">
                  In all shops
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <StockStatusDistribution data={stockStatus} />
            <TopShopsByStock shops={topShops} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Shop Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Manage your shops and create new ones.</p>
                <Button asChild>
                  <Link href="/shop">
                    View Shops
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Manage your products across all shops.</p>
                <Button asChild>
                  <Link href="/products">
                    View Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button asChild variant="outline">
                  <Link href="/shop/create">Create New Shop</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/products/create">Add New Product</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

