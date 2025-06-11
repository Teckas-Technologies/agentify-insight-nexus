
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChartComponent } from "@/components/dashboard/BarChartComponent";
import { AgentUsageChart } from "@/components/dashboard/AgentUsageChart";
import { TransactionTable } from "@/components/admin/TransactionTable";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { TopChainsChart } from "@/components/admin/TopChainsChart";
import { Users, Activity, DollarSign, TrendingUp, Zap, Globe } from "lucide-react";

// Mock data - in a real app, this would come from your API
const analyticsData = {
  totalUsers: 8547,
  totalTransactions: 16690,
  totalVolume: 103000,
  activeAgents: 5,
  avgTransactionValue: 6.2,
  userGrowth: 11.8,
  volumeGrowth: 16.5,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
            trend={{ value: 7.8, isPositive: true }}
          />
          <StatCard
            title="Volume (USD)"
            value={`$${(analyticsData.totalVolume / 1000).toFixed(0)}K`}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: analyticsData.volumeGrowth, isPositive: true }}
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
            trend={{ value: 1.8, isPositive: true }}
          />
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserGrowthChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Chains by Volume</CardTitle>
                  <CardDescription>Transaction volume by blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopChainsChart />
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Usage Distribution</CardTitle>
                  <CardDescription>Most popular agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <AgentUsageChart data={[
                    { name: "Swap Agent", value: 42, color: "hsl(262, 83.3%, 57.8%)" },
                    { name: "Bridge Agent", value: 28, color: "hsl(12, 76.4%, 64.7%)" },
                    { name: "Lending Agent", value: 18, color: "hsl(142, 76.2%, 36.3%)" },
                    { name: "Staking Agent", value: 12, color: "hsl(48, 96%, 53%)" },
                  ]} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Volume Trend</CardTitle>
                  <CardDescription>Monthly transaction volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartComponent 
                    data={[
                      { name: "Jan", value: 12.2 },
                      { name: "Feb", value: 14.8 },
                      { name: "Mar", value: 18.4 },
                      { name: "Apr", value: 22.7 },
                      { name: "May", value: 26.9 },
                      { name: "Jun", value: 32.1 },
                    ]}
                    title="Volume (K USD)"
                    yAxisLabel="Volume"
                    barColor="hsl(142, 76.2%, 36.3%)"
                  />
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
                      { name: "Daily", value: 385 },
                      { name: "Weekly", value: 1420 },
                      { name: "Monthly", value: 8547 },
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
                      { name: "Swap", value: 7010 },
                      { name: "Bridge", value: 4673 },
                      { name: "Lend", value: 3004 },
                      { name: "Stake", value: 2003 },
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
                      { name: "Swap", value: 98.2 },
                      { name: "Bridge", value: 94.8 },
                      { name: "Lend", value: 99.3 },
                      { name: "Stake", value: 97.5 },
                    ]}
                    title="Success Rate (%)"
                    yAxisLabel="Success Rate"
                    barColor="hsl(142, 76.2%, 36.3%)"
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
