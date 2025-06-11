
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChartComponent } from "@/components/dashboard/BarChartComponent";
import { AgentUsageChart } from "@/components/dashboard/AgentUsageChart";
import { TransactionTable } from "@/components/admin/TransactionTable";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { TopChainsChart } from "@/components/admin/TopChainsChart";
import { Users, Activity, DollarSign, TrendingUp, Zap, Globe } from "lucide-react";

// Mock data - in a real app, this would come from your API
const analyticsData = {
  totalUsers: 12847,
  totalTransactions: 45623,
  totalVolume: 2847392.45,
  totalRevenue: 28473.92,
  activeAgents: 8,
  avgTransactionValue: 62.4,
  userGrowth: 12.5,
  volumeGrowth: 18.2,
  revenueGrowth: 15.8,
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform analytics and insights</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Users"
            value={analyticsData.totalUsers.toLocaleString()}
            icon={<Users className="h-5 w-5" />}
            trend={{ value: analyticsData.userGrowth, isPositive: true }}
          />
          <StatCard
            title="Total Transactions"
            value={analyticsData.totalTransactions.toLocaleString()}
            icon={<Activity className="h-5 w-5" />}
            trend={{ value: 8.3, isPositive: true }}
          />
          <StatCard
            title="Volume (USD)"
            value={`$${(analyticsData.totalVolume / 1000000).toFixed(2)}M`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: analyticsData.volumeGrowth, isPositive: true }}
          />
          <StatCard
            title="Revenue (USD)"
            value={`$${analyticsData.totalRevenue.toLocaleString()}`}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: analyticsData.revenueGrowth, isPositive: true }}
          />
          <StatCard
            title="Active Agents"
            value={analyticsData.activeAgents}
            icon={<Zap className="h-5 w-5" />}
          />
          <StatCard
            title="Avg Transaction"
            value={`$${analyticsData.avgTransactionValue}`}
            icon={<Globe className="h-5 w-5" />}
            trend={{ value: 2.1, isPositive: true }}
          />
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="chains">Chains</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserGrowthChart />
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Chains by Volume</CardTitle>
                  <CardDescription>Transaction volume by blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopChainsChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Agent Usage Distribution</CardTitle>
                  <CardDescription>Most popular agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <AgentUsageChart data={[
                    { name: "Swap Agent", value: 45, color: "hsl(262, 83.3%, 57.8%)" },
                    { name: "Bridge Agent", value: 28, color: "hsl(12, 76.4%, 64.7%)" },
                    { name: "Lending Agent", value: 15, color: "hsl(142, 76.2%, 36.3%)" },
                    { name: "Staking Agent", value: 12, color: "hsl(48, 96%, 53%)" },
                  ]} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest platform transactions with details</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Registration Trend</CardTitle>
                  <CardDescription>Daily new user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserGrowthChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Active users by time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartComponent 
                    data={[
                      { name: "Daily", value: 1247 },
                      { name: "Weekly", value: 4832 },
                      { name: "Monthly", value: 12847 },
                    ]}
                    title="Active Users"
                    yAxisLabel="Users"
                    barColor="hsl(142, 76.2%, 36.3%)"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                  <CardDescription>Transaction count by agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartComponent 
                    data={[
                      { name: "Swap", value: 20534 },
                      { name: "Bridge", value: 12789 },
                      { name: "Lend", value: 6843 },
                      { name: "Stake", value: 5457 },
                    ]}
                    title="Transactions by Agent"
                    yAxisLabel="Transactions"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Agent Success Rate</CardTitle>
                  <CardDescription>Success rate percentage by agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartComponent 
                    data={[
                      { name: "Swap", value: 98.5 },
                      { name: "Bridge", value: 94.2 },
                      { name: "Lend", value: 99.1 },
                      { name: "Stake", value: 97.8 },
                    ]}
                    title="Success Rate (%)"
                    yAxisLabel="Success Rate"
                    barColor="hsl(142, 76.2%, 36.3%)"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chains">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chain Distribution</CardTitle>
                  <CardDescription>Transaction volume by blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopChainsChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gas Fees by Chain</CardTitle>
                  <CardDescription>Average gas fees (USD)</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartComponent 
                    data={[
                      { name: "Ethereum", value: 12.45 },
                      { name: "Arbitrum", value: 0.85 },
                      { name: "Polygon", value: 0.12 },
                      { name: "Optimism", value: 0.95 },
                      { name: "Base", value: 0.08 },
                    ]}
                    title="Average Gas Fees"
                    yAxisLabel="USD"
                    barColor="hsl(12, 76.4%, 64.7%)"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
