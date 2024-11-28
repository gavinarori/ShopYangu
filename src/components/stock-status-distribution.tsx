import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StockStatusData {
  inStock: number;
  outOfStock: number;
  lowStock: number;
}

interface StockStatusDistributionProps {
  data: StockStatusData;
}

const COLORS = ['#4CAF50', '#F44336', '#FFC107'];

export function StockStatusDistribution({ data }: StockStatusDistributionProps) {
  const chartData = [
    { name: 'In Stock', value: data.inStock },
    { name: 'Out of Stock', value: data.outOfStock },
    { name: 'Low Stock', value: data.lowStock },
  ];

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Stock Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

