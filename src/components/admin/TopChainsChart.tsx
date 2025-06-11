
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chainData = [
  { name: "Ethereum", volume: 1250000, transactions: 15234 },
  { name: "Arbitrum", volume: 890000, transactions: 23456 },
  { name: "Polygon", volume: 650000, transactions: 18567 },
  { name: "Optimism", volume: 420000, transactions: 9834 },
  { name: "Base", volume: 380000, transactions: 12456 },
  { name: "BSC", volume: 290000, transactions: 7892 },
  { name: "Avalanche", volume: 180000, transactions: 5234 },
];

export const TopChainsChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chainData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(240 10% 3.9%)', 
              borderColor: 'hsl(240 3.7% 15.9%)',
              borderRadius: '0.5rem'
            }} 
            formatter={(value: number, name: string) => [
              name === 'volume' ? `$${value.toLocaleString()}` : value.toLocaleString(),
              name === 'volume' ? 'Volume' : 'Transactions'
            ]}
          />
          <Bar 
            dataKey="volume" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
            name="volume"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
