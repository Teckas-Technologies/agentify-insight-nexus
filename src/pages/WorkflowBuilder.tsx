
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Play, Settings, Grid, Download, Upload, Copy, Trash2, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { NodePanel } from '@/components/workflow/NodePanel';
import { ConfigPanel } from '@/components/workflow/ConfigPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useToast } from '@/components/ui/use-toast';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut } from '@/components/ui/menubar';

// Mock workflow data for loading specific workflows
const workflowsData = {
  'w1': {
    id: 'w1',
    name: 'Token Swap Pipeline',
    nodes: [
      { id: 'web3-wallet-1', type: 'web3-wallet', position: { x: 100, y: 100 }, data: { title: 'Load Wallet', params: { privateKey: '{{ENV.WALLET_KEY}}', network: 'ethereum' } } },
      { id: 'web3-defi-1', type: 'web3-defi', position: { x: 400, y: 100 }, data: { title: 'Swap Tokens', params: { tokenIn: 'USDT', tokenOut: 'ETH', amount: 100, slippage: 0.5 } } }
    ],
    connections: [
      { id: 'connection-1', source: 'web3-wallet-1', target: 'web3-defi-1' }
    ]
  },
  'w2': {
    id: 'w2',
    name: 'DeFi Monitor & Alert',
    nodes: [
      { id: 'web3-monitoring-1', type: 'web3-monitoring', position: { x: 100, y: 100 }, data: { title: 'Monitor Gas Fees', params: { threshold: 50 } } },
      { id: 'web2-social-1', type: 'web2-social', position: { x: 400, y: 100 }, data: { title: 'Telegram Alert', params: { message: 'Gas price alert: {{data.gasPrice}} gwei' } } },
      { id: 'web2-time-1', type: 'web2-time', position: { x: 100, y: 300 }, data: { title: 'Daily Summary', params: { schedule: '0 20 * * *' } } },
      { id: 'web2-social-2', type: 'web2-social', position: { x: 400, y: 300 }, data: { title: 'Email Report', params: { subject: 'Daily Gas Report' } } }
    ],
    connections: [
      { id: 'connection-1', source: 'web3-monitoring-1', target: 'web2-social-1' },
      { id: 'connection-2', source: 'web2-time-1', target: 'web2-social-2' }
    ]
  },
  'w3': {
    id: 'w3', 
    name: 'Cross-chain Bridging',
    nodes: [
      { id: 'web3-wallet-1', type: 'web3-wallet', position: { x: 100, y: 100 }, data: { title: 'Source Wallet', params: { network: 'ethereum' } } },
      { id: 'web3-token-1', type: 'web3-token', position: { x: 400, y: 100 }, data: { title: 'Transfer USDC', params: { amount: 1000 } } },
      { id: 'web3-wallet-2', type: 'web3-wallet', position: { x: 700, y: 100 }, data: { title: 'Destination Wallet', params: { network: 'arbitrum' } } }
    ],
    connections: [
      { id: 'connection-1', source: 'web3-wallet-1', target: 'web3-token-1' },
      { id: 'connection-2', source: 'web3-token-1', target: 'web3-wallet-2' }
    ]
  }
};

const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workflowName, setWorkflowName] = useState(id ? `Workflow ${id}` : "New Workflow");
  const [selectedNode, setSelectedNode] = useState<any>(null);
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

  // Handle updating node data when configuration changes
  const handleUpdateNode = (nodeId: string, data: any) => {
    // Update the selected node's data
    setSelectedNode(prev => {
      if (prev && prev.id === nodeId) {
        return { ...prev, data };
      }
      return prev;
    });
    
    // Dispatch event to update node in canvas
    const event = new CustomEvent('updateNode', { 
      detail: { nodeId, data }
    });
    document.dispatchEvent(event);
  };

  // Handle deleting a node
  const handleDeleteNode = (nodeId: string) => {
    // Dispatch event to delete node from canvas
    const event = new CustomEvent('deleteNode', { 
      detail: { nodeId }
    });
    document.dispatchEvent(event);
    
    // Clear selected node if it's the one being deleted
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Navbar />
      
      {/* Workflow Builder Header */}
      <div className="border-b border-white/10 bg-[#121212]/95 backdrop-blur-sm">
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
            
            <Menubar className="bg-white/5 border-white/10">
              <MenubarMenu>
                <MenubarTrigger className="text-white/70">File</MenubarTrigger>
                <MenubarContent className="bg-[#1E1E1E] border-white/10">
                  <MenubarItem className="focus:bg-white/10">
                    New Workflow <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    Open... <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="focus:bg-white/10" onClick={handleSaveWorkflow}>
                    Save <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    Save As... <MenubarShortcut>⇧⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="focus:bg-white/10">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    <Upload className="h-4 w-4 mr-2" />
                    Import JSON
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              
              <MenubarMenu>
                <MenubarTrigger className="text-white/70">Edit</MenubarTrigger>
                <MenubarContent className="bg-[#1E1E1E] border-white/10">
                  <MenubarItem className="focus:bg-white/10">
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="focus:bg-white/10">
                    Cut <MenubarShortcut>⌘X</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    Copy <MenubarShortcut>⌘C</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    Paste <MenubarShortcut>⌘V</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              
              <MenubarMenu>
                <MenubarTrigger className="text-white/70">View</MenubarTrigger>
                <MenubarContent className="bg-[#1E1E1E] border-white/10">
                  <MenubarItem className="focus:bg-white/10">
                    Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    Reset View <MenubarShortcut>⌘0</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="focus:bg-white/10">
                    Toggle Minimap
                  </MenubarItem>
                  <MenubarItem className="focus:bg-white/10">
                    Toggle Grid
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-background/50 border-white/10"
              >
                <Undo className="h-4 w-4" />
                <span>Undo</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-background/50 border-white/10"
              >
                <Redo className="h-4 w-4" />
                <span>Redo</span>
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
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
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
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-[#141414] border-r border-white/10">
          <NodePanel />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Canvas */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <WorkflowCanvas 
            onSelectNode={setSelectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Config Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-[#141414]">
          <ConfigPanel 
            selectedNode={selectedNode} 
            onUpdateNodeData={handleUpdateNode} 
            onDeleteNode={handleDeleteNode}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default WorkflowBuilder;
