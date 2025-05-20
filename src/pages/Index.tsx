
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Activity,
  ArrowRight,
  Plus,
  Box,
  Play,
  Clock,
  LayoutGrid,
  FileLineChart,
  Workflow
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

// Mock workflow data
const recentWorkflows = [
  {
    id: "w1",
    name: "ETH to USDC Swap Pipeline",
    description: "Automated swap from ETH to USDC on trigger",
    runs: 24,
    lastRun: "2024-05-19T15:30:00Z",
    status: "active",
  },
  {
    id: "w2",
    name: "Daily DeFi Portfolio Rebalancer",
    description: "Rebalances portfolio across multiple protocols",
    runs: 45,
    lastRun: "2024-05-19T08:15:00Z",
    status: "active",
  },
  {
    id: "w3",
    name: "Cross-chain Bridging Automation",
    description: "Automated funds transfer between Ethereum and Polygon",
    runs: 12,
    lastRun: "2024-05-18T22:45:00Z",
    status: "inactive",
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);
  const hasWorkflows = recentWorkflows.length > 0;

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Workflow Dashboard</h1>
          {isWalletConnected && (
            <Button 
              variant="default" 
              className="neumorphic-sm flex items-center gap-2 bg-primary hover:bg-primary/90"
              onClick={() => navigate('/workflow-builder')}
            >
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          )}
        </div>

        {/* Pre-connect state */}
        {!isWalletConnected ? (
          <Card className="neumorphic border-none bg-gradient-to-b from-background/90 to-background/70">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10 ring-1 ring-primary/20 mb-2">
                <Workflow className="h-8 w-8 text-primary/80" />
              </div>
              <h3 className="text-xl font-medium">Connect to start building blockchain workflows</h3>
              <p className="max-w-md text-muted-foreground leading-relaxed">
                Combine multiple blockchain operations into automated workflows that execute exactly how you define them.
              </p>
              <Button 
                size="lg" 
                className="mt-2 bg-primary hover:bg-primary/90"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Workflows Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Workflows</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Grid</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Recent</span>
                  </Button>
                </div>
              </div>

              {hasWorkflows ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentWorkflows.map((workflow) => (
                    <Card 
                      key={workflow.id} 
                      className={cn(
                        "neumorphic border-none hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer",
                        workflow.status === "inactive" && "opacity-70"
                      )}
                      onClick={() => navigate(`/workflow-builder/${workflow.id}`)}
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3 mt-1">
                            <div className={cn(
                              "p-2 rounded-md",
                              workflow.status === "active" ? "bg-primary/10 text-primary" : "bg-muted/20 text-muted-foreground"
                            )}>
                              <Box className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-base">{workflow.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{workflow.description}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 text-xs text-muted-foreground">
                          <span>Runs: {workflow.runs}</span>
                          <span>Last: {new Date(workflow.lastRun).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Create New Workflow Card */}
                  <Card 
                    className="neumorphic border-dashed border-white/20 hover:border-primary/40 transition-all duration-300 cursor-pointer flex items-center justify-center bg-background/50"
                    onClick={() => navigate('/workflow-builder')}
                  >
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full py-12">
                      <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                        <Plus className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium">Create New Workflow</h3>
                      <p className="text-xs text-muted-foreground mt-1">Build a custom automation workflow</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <EmptyState 
                  title="No workflows yet" 
                  description="Create your first blockchain workflow to get started" 
                  icon={<FileLineChart className="h-12 w-12 text-muted-foreground/50" />}
                >
                  <Button 
                    onClick={() => navigate('/workflow-builder')} 
                    className="mt-4 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Workflow
                  </Button>
                </EmptyState>
              )}
            </div>

            {/* Templates Section */}
            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-semibold">Workflow Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <WorkflowTemplate 
                  title="Token Swap Workflow" 
                  description="Automate token swaps with price conditions" 
                  icon={<ArrowRight className="h-5 w-5" />}
                  onClick={() => navigate('/workflow-builder?template=swap')}
                />
                <WorkflowTemplate 
                  title="DeFi Yield Optimizer" 
                  description="Auto-compound yields across protocols" 
                  icon={<Activity className="h-5 w-5" />}
                  onClick={() => navigate('/workflow-builder?template=yield')}
                />
                <WorkflowTemplate 
                  title="Cross-chain Bridge" 
                  description="Transfer assets between blockchains" 
                  icon={<Box className="h-5 w-5" />}
                  onClick={() => navigate('/workflow-builder?template=bridge')}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Template card component
const WorkflowTemplate = ({ title, description, icon, onClick }) => (
  <Card 
    className="neumorphic border-none hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer bg-gradient-to-br from-background/90 to-background/70"
    onClick={onClick}
  >
    <CardContent className="p-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Index;
