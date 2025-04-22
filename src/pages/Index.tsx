import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { SavedCommand } from "@/components/dashboard/SavedCommand";
import { AgentUsageChart } from "@/components/dashboard/AgentUsageChart";
import { BarChartComponent } from "@/components/dashboard/BarChartComponent";
import { ChainBadge } from "@/components/dashboard/ChainBadge";
import { TipCard } from "@/components/dashboard/TipCard";
import { TransactionLogs } from "@/components/dashboard/TransactionLogs";
import {
  Activity,
  ArrowRight,
  CircleDollarSign,
  Globe,
  PlayCircle,
  Repeat2,
  Terminal,
  Lightbulb,
  Bell,
} from "lucide-react";
import {
  executionSummaryData,
  recentActivityData,
  savedCommandsData,
  agentUsageData,
  chainActivityData,
  gasUsageData,
  gasHistoryData,
  tipsData,
} from "@/data/mockData";
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const recentNotifications = [
  {
    title: "New Agent Available",
    description: "Bridge Agent is now available for cross-chain transactions",
    timestamp: "2 hours ago",
    type: "info"
  },
  {
    title: "Gas Price Alert",
    description: "ETH gas prices are currently below average",
    timestamp: "4 hours ago",
    type: "success"
  },
  {
    title: "Scheduled Maintenance",
    description: "Platform maintenance scheduled for tomorrow",
    timestamp: "1 day ago",
    type: "warning"
  }
];

const quickActions = [
  {
    title: "Quick Swap",
    description: "Swap tokens with minimal clicks",
    icon: Repeat2,
    action: "/playground"
  },
  {
    title: "Command History",
    description: "View your recent commands",
    icon: Terminal,
    action: "/commands"
  },
  {
    title: "Run Last Command",
    description: "Execute your most recent transaction",
    icon: PlayCircle,
    action: "/playground"
  }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="neumorphic-sm flex items-center gap-2"
            onClick={() => navigate('/playground')}
          >
            <Terminal className="h-4 w-4" />
            Go to Playground
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Execution Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Commands Executed"
            value={executionSummaryData.commandsExecuted}
            icon={<Terminal className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Most Used Agent"
            value={executionSummaryData.mostUsedAgent}
            icon={<Repeat2 className="h-5 w-5" />}
          />
          <StatCard
            title="Tokens Swapped"
            value={executionSummaryData.tokensSwapped}
            icon={<CircleDollarSign className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Chains Interacted"
            value={executionSummaryData.chainsInteracted}
            icon={<Globe className="h-5 w-5" />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity Timeline */}
            <Card className="neumorphic border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground text-xs"
                  onClick={() => navigate('/activity')}
                >
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {recentActivityData.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      title={activity.title}
                      description={activity.description}
                      timestamp={activity.timestamp}
                      status={activity.status}
                      icon={<Activity className="h-4 w-4" />}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agent Usage Chart */}
              <Card className="neumorphic border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Agent Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentUsageChart data={agentUsageData} />
                </CardContent>
              </Card>

              {/* Gas Usage Chart */}
              <Card className="neumorphic border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Gas Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Gas</p>
                      <p className="text-xl font-bold">{gasUsageData.totalGas}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg per Tx</p>
                      <p className="text-xl font-bold">{gasUsageData.avgGas}</p>
                    </div>
                  </div>
                  <BarChartComponent 
                    data={gasHistoryData} 
                    barColor="hsl(var(--primary))"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Section - New location */}
            <Card className="neumorphic border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start gap-3 h-auto p-3"
                      onClick={() => navigate(action.action)}
                    >
                      <div className="p-2 rounded-full bg-primary/10">
                        <action.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Notifications Section - New location */}
            <Card className="neumorphic border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground text-xs"
                >
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentNotifications.map((notification, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-primary/5 transition-colors"
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2",
                        {
                          'bg-green-500': notification.type === 'success',
                          'bg-blue-500': notification.type === 'info',
                          'bg-yellow-500': notification.type === 'warning',
                          'bg-red-500': notification.type === 'error'
                        }
                      )} />
                      <div>
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">{notification.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chain Activity Map */}
            <Card className="neumorphic border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Chain Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {chainActivityData.map((chain, index) => (
                    <ChainBadge
                      key={chain.name}
                      name={chain.name}
                      count={chain.count}
                      color={
                        index === 0
                          ? "bg-primary/20"
                          : index === 1
                          ? "bg-accent/20"
                          : index === 2
                          ? "bg-success/20"
                          : "bg-secondary"
                      }
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Saved Commands */}
            <Card className="neumorphic border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Saved Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedCommandsData.map((command) => (
                    <SavedCommand
                      key={command.id}
                      title={command.title}
                      command={command.command}
                      icon={<PlayCircle className="h-4 w-4" />}
                    />
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-2" 
                    size="sm"
                    onClick={() => navigate('/commands')}
                  >
                    View All Commands
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Logs */}
            <Card className="neumorphic border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Transaction Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="neumorphic-inset p-1 mb-4">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="swap" className="text-xs">Swaps</TabsTrigger>
                    <TabsTrigger value="bridge" className="text-xs">Bridges</TabsTrigger>
                    <TabsTrigger value="lend" className="text-xs">Lending</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="m-0">
                    <div className="space-y-4">
                      <TransactionLogs limit={3} />
                      <Button 
                        className="glow w-full" 
                        onClick={() => navigate('/transactions')}
                      >
                        View All Transactions
                      </Button>
                    </div>
                  </TabsContent>
                  {/* Other tab contents would be similar */}
                </Tabs>
              </CardContent>
            </Card>

            {/* Remove Quick Actions and Notifications sections from here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
