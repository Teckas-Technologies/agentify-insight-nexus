
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chainData = [
  { name: "Ethereum", volume: 32000, transactions: 4200 },
  { name: "Arbitrum", volume: 23500, transactions: 3890 },
  { name: "Polygon", volume: 18200, transactions: 2950 },
  { name: "Optimism", volume: 12800, transactions: 1680 },
  { name: "Base", volume: 9200, transactions: 1890 },
  { name: "BSC", volume: 4800, transactions: 1230 },
  { name: "Avalanche", volume: 2500, transactions: 850 },
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
