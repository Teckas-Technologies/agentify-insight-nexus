
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Play, Plus, Settings, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { NodePanel } from '@/components/workflow/NodePanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useToast } from '@/components/ui/use-toast';

// Mock workflow data for loading specific workflows
const workflowsData = {
  'w1': {
    id: 'w1',
    name: 'ETH to USDC Swap Pipeline',
    nodes: [
      { id: 'trigger-1', type: 'triggers', position: { x: 100, y: 100 }, data: { title: 'Price Alert' } },
      { id: 'operation-1', type: 'operations', position: { x: 350, y: 100 }, data: { title: 'Token Swap' } }
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' }
    ]
  },
  'w2': {
    id: 'w2',
    name: 'Daily DeFi Portfolio Rebalancer',
    nodes: [
      { id: 'trigger-1', type: 'triggers', position: { x: 100, y: 100 }, data: { title: 'Price Alert' } },
      { id: 'operation-1', type: 'operations', position: { x: 350, y: 100 }, data: { title: 'Token Swap' } },
      { id: 'utility-1', type: 'utilities', position: { x: 600, y: 100 }, data: { title: 'Notification' } }
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' },
      { id: 'connection-2', source: 'operation-1', target: 'utility-1' }
    ]
  },
  'w3': {
    id: 'w3', 
    name: 'Cross-chain Bridging Automation',
    nodes: [
      { id: 'trigger-1', type: 'triggers', position: { x: 100, y: 100 }, data: { title: 'Blockchain Event' } },
      { id: 'operation-1', type: 'operations', position: { x: 350, y: 100 }, data: { title: 'Bridge Assets' } }
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' }
    ]
  }
};

const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workflowName, setWorkflowName] = useState(id ? `Workflow ${id}` : "New Workflow");
  const { toast } = useToast();
  
  // Load workflow data if ID is provided
  useEffect(() => {
    if (id && workflowsData[id as keyof typeof workflowsData]) {
      const workflow = workflowsData[id as keyof typeof workflowsData];
      setWorkflowName(workflow.name);
      
      // Create a custom event to load the workflow nodes onto the canvas
      const event = new CustomEvent('applyTemplate', { 
        detail: { template: workflow }
      });
      document.dispatchEvent(event);
    }
  }, [id]);
  
  // Handle save workflow action
  const handleSaveWorkflow = () => {
    toast({
      title: "Workflow Saved",
      description: `${workflowName} has been saved successfully.`
    });
  };
  
  // Handle test run action
  const handleTestRun = () => {
    toast({
      title: "Test Run Initiated",
      description: "Running workflow in test environment..."
    });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      {/* Workflow Builder Header */}
      <div className="border-b border-white/10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="border-none bg-transparent focus:bg-white/5 text-lg font-medium px-3 py-1 h-auto w-auto min-w-[240px] focus-visible:ring-white/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2 bg-background/50 border-white/10">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-background/50 border-white/10"
                onClick={handleTestRun}
              >
                <Play className="h-4 w-4" />
                <span>Test Run</span>
              </Button>
              <Button 
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                onClick={handleSaveWorkflow}
              >
                <Save className="h-4 w-4" />
                <span>Save Workflow</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Workflow Builder Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Nodes Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-background border-r border-white/10">
          <NodePanel />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Canvas */}
        <ResizablePanel defaultSize={80}>
          <WorkflowCanvas />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default WorkflowBuilder;
