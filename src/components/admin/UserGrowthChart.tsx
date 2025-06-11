
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const userGrowthData = [
  { month: "Jan", users: 1200, newUsers: 250 },
  { month: "Feb", users: 1680, newUsers: 480 },
  { month: "Mar", users: 2350, newUsers: 670 },
  { month: "Apr", users: 3200, newUsers: 850 },
  { month: "May", users: 4100, newUsers: 900 },
  { month: "Jun", users: 5200, newUsers: 1100 },
  { month: "Jul", users: 6800, newUsers: 1600 },
  { month: "Aug", users: 8200, newUsers: 1400 },
  { month: "Sep", users: 9900, newUsers: 1700 },
  { month: "Oct", users: 11200, newUsers: 1300 },
  { month: "Nov", users: 12100, newUsers: 900 },
  { month: "Dec", users: 12847, newUsers: 747 },
];

export const UserGrowthChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={userGrowthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
          />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            name="Total Users"
          />
          <Line 
            type="monotone" 
            dataKey="newUsers" 
            stroke="hsl(142, 76.2%, 36.3%)" 
            strokeWidth={2}
            name="New Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
