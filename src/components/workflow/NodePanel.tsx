
import React, { useState } from 'react';
import { Search, ArrowLeftRight, Wallet, Database, Layers, ArrowDown, Clock, Zap, FileLineChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

// Node categories and their nodes
const nodeCategories = [
  {
    id: 'triggers',
    name: 'Triggers',
    nodes: [
      { id: 'time-trigger', name: 'Time Trigger', icon: Clock, description: 'Run workflow at specified times' },
      { id: 'event-trigger', name: 'Blockchain Event', icon: Zap, description: 'Triggered by blockchain events' },
      { id: 'webhook-trigger', name: 'Webhook', icon: ArrowDown, description: 'Triggered by external webhook' },
      { id: 'price-trigger', name: 'Price Alert', icon: FileLineChart, description: 'Triggered by price changes' },
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    nodes: [
      { id: 'swap', name: 'Token Swap', icon: ArrowLeftRight, description: 'Swap between tokens' },
      { id: 'bridge', name: 'Bridge Assets', icon: Layers, description: 'Bridge assets between chains' },
      { id: 'wallet', name: 'Wallet Operation', icon: Wallet, description: 'Interact with wallets' },
      { id: 'contract-call', name: 'Contract Call', icon: Database, description: 'Call smart contract functions' },
    ]
  },
  {
    id: 'utilities',
    name: 'Utilities',
    nodes: [
      { id: 'conditional', name: 'Conditional', icon: ArrowLeftRight, description: 'Add conditional logic' },
      { id: 'delay', name: 'Delay', icon: Clock, description: 'Add delay between steps' },
      { id: 'transform', name: 'Transform Data', icon: ArrowLeftRight, description: 'Transform data between nodes' },
      { id: 'notification', name: 'Notification', icon: Zap, description: 'Send notifications' },
    ]
  },
];

export const NodePanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter nodes based on search term and active tab
  const filteredNodes = nodeCategories.flatMap(category => {
    return category.nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (activeTab === 'all' || activeTab === category.id)
    );
  });

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, node: any, category: string) => {
    e.dataTransfer.setData("node-type", category);
    e.dataTransfer.setData("node-title", node.name);
    e.dataTransfer.effectAllowed = "move";
  };
  
  const renderNodeItem = (node: any, category: string) => (
    <div 
      key={node.id} 
      className="p-3 rounded-md hover:bg-white/5 cursor-grab flex items-center gap-3 mb-2 border border-white/5 hover:border-primary/20 transition-all duration-200"
      draggable
      onDragStart={(e) => handleDragStart(e, node, category)}
    >
      <div className={`p-2 rounded-md ${
        category === 'triggers' ? 'bg-blue-500/10 text-blue-500' : 
        category === 'operations' ? 'bg-green-500/10 text-green-500' : 
        'bg-purple-500/10 text-purple-500'
      }`}>
        <node.icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium">{node.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{node.description}</p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold mb-4">Workflow Tools</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-9 bg-white/5 border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="triggers" className="flex-1">Triggers</TabsTrigger>
            <TabsTrigger value="operations" className="flex-1">Operations</TabsTrigger>
            <TabsTrigger value="utilities" className="flex-1">Utils</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {searchTerm || activeTab !== 'all' ? (
            <div className="space-y-2">
              {filteredNodes.length > 0 ? 
                filteredNodes.map(node => {
                  // Find which category this node belongs to
                  const category = nodeCategories.find(cat => 
                    cat.nodes.some(n => n.id === node.id)
                  )?.id || 'utilities';
                  
                  return renderNodeItem(node, category);
                }) : 
                <p className="text-sm text-muted-foreground text-center py-4">No nodes match your search</p>
              }
            </div>
          ) : (
            <>
              {nodeCategories.map((category) => (
                <div key={category.id} className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category.name}</h3>
                  <div className="space-y-2">
                    {category.nodes.map(node => renderNodeItem(node, category.id))}
                  </div>
                </div>
              ))}
            </>
          )}
          
          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Templates</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left">
                <Clock className="h-4 w-4 mr-2" />
                Simple Swap
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                <FileLineChart className="h-4 w-4 mr-2" />
                Price Alert + Swap
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                <Database className="h-4 w-4 mr-2" />
                Contract Watcher
              </Button>
            </div>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
