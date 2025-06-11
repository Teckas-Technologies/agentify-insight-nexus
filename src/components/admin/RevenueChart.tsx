
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 1250, fees: 890 },
  { month: "Feb", revenue: 1680, fees: 1200 },
  { month: "Mar", revenue: 2350, fees: 1890 },
  { month: "Apr", revenue: 3200, fees: 2450 },
  { month: "May", revenue: 4100, fees: 3200 },
  { month: "Jun", revenue: 5200, fees: 4100 },
  { month: "Jul", revenue: 6800, fees: 5300 },
  { month: "Aug", revenue: 8200, fees: 6450 },
  { month: "Sep", revenue: 9900, fees: 7800 },
  { month: "Oct", revenue: 12200, fees: 9650 },
  { month: "Nov", revenue: 15100, fees: 12100 },
  { month: "Dec", revenue: 18474, fees: 14800 },
];

export const RevenueChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(240 10% 3.9%)', 
              borderColor: 'hsl(240 3.7% 15.9%)',
              borderRadius: '0.5rem'
            }} 
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stackId="1"
            stroke="hsl(var(--primary))" 
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
            name="Total Revenue"
          />
          <Area 
            type="monotone" 
            dataKey="fees" 
            stackId="1"
            stroke="hsl(142, 76.2%, 36.3%)" 
            fill="hsl(142, 76.2%, 36.3%)"
            fillOpacity={0.6}
            name="Platform Fees"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
