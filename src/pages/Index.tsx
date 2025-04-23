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
import { NoActivityState } from "@/components/dashboard/NoActivityState";
import { NoCommandsState } from "@/components/dashboard/NoCommandsState";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Activity,
  ArrowRight,
  CircleDollarSign,
  Globe,
  PlayCircle,
  Repeat2,
  Terminal,
  PieChart,
  Database
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import {
  executionSummaryData,
  savedCommandsData,
} from "@/data/commands";
import {
  agentUsageData,
  chainActivityData,
} from "@/data/agents";
import {
  gasUsageData,
  gasHistoryData,
} from "@/data/gas";
import { recentActivityData } from "@/data/activity";
import { cn } from "@/lib/utils";
import { TransactionLogs } from "@/components/dashboard/TransactionLogs";

const Index = () => {
  const navigate = useNavigate();
  
  // Simulating empty states
  const hasRecentActivity = false;
  const hasSavedCommands = false;
  const hasTransactionLogs = false;
  const hasAgentUsage = false;
  const hasGasUsage = false;

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
            value="0"
            icon={<Terminal className="h-5 w-5" />}
          />
          <StatCard
            title="Most Used Agent"
            value="None"
            icon={<Repeat2 className="h-5 w-5" />}
          />
          <StatCard
            title="Tokens Swapped"
            value="$0"
            icon={<CircleDollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Chains Interacted"
            value="0"
            icon={<Globe className="h-5 w-5" />}
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
                {!hasRecentActivity && <NoActivityState />}
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
                  {!hasAgentUsage && (
                    <EmptyState
                      title="No Agent Usage"
                      description="Agent usage statistics will appear here once you start using agents."
                      icon={<PieChart className="h-12 w-12 text-muted-foreground/50" />}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Gas Usage Chart */}
              <Card className="neumorphic border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Gas Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  {!hasGasUsage && (
                    <EmptyState
                      title="No Gas Usage"
                      description="Your gas usage statistics will appear here once you start making transactions."
                      icon={<Database className="h-12 w-12 text-muted-foreground/50" />}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Saved Commands */}
            <Card className="neumorphic border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Saved Commands</CardTitle>
              </CardHeader>
              <CardContent>
                {!hasSavedCommands && <NoCommandsState />}
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
                    {!hasTransactionLogs && (
                      <EmptyState
                        title="No Transactions"
                        description="Your transaction logs will appear here once you start making transactions."
                        icon={<Activity className="h-12 w-12 text-muted-foreground/50" />}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
