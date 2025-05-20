
import React, { useState } from 'react';
import { Search, ArrowLeftRight, Wallet, Database, Layers, ArrowDown, Clock, Zap, FileLineChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  const renderNodeItem = (node) => (
    <div 
      key={node.id} 
      className="p-3 rounded-md hover:bg-white/5 cursor-grab flex items-center gap-3 mb-2 border border-white/5 hover:border-primary/20 transition-all duration-200"
      draggable
    >
      <div className="p-2 rounded-md bg-primary/10 text-primary">
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
        <h2 className="text-lg font-semibold mb-4">Nodes</h2>
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
          <TabsList className="w-full neumorphic-inset">
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
                filteredNodes.map(renderNodeItem) : 
                <p className="text-sm text-muted-foreground text-center py-4">No nodes match your search</p>
              }
            </div>
          ) : (
            <>
              {nodeCategories.map((category) => (
                <div key={category.id} className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category.name}</h3>
                  <div className="space-y-2">
                    {category.nodes.map(renderNodeItem)}
                  </div>
                </div>
              ))}
            </>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
};
