import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ShopStock {
  name: string;
  stockCount: number;
}

interface TopShopsByStockProps {
  shops: ShopStock[];
}

export function TopShopsByStock({ shops }: TopShopsByStockProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 5 Shops by Stock Level</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {shops.map((shop, index) => (
            <li key={shop.name} className="flex justify-between items-center">
              <span className="font-medium">{index + 1}. {shop.name}</span>
              <span className="text-sm text-muted-foreground">{shop.stockCount} products in stock</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

