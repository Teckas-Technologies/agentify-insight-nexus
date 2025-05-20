
import React, { useState } from 'react';
import { Search, ArrowLeftRight, Wallet, Database, Layers, ArrowDown, Clock, Zap, FileLineChart, Calendar, User, Edit, Plus, Minus, Settings, Compare, Calendar as DateIcon, Clock as TimeIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Node categories and their nodes
const nodeCategories = [
  {
    id: 'triggers',
    name: 'Triggers',
    nodes: [
      { id: 'schedule-trigger', name: 'Schedule Trigger', icon: Clock, description: 'Run workflow at specified times' },
      { id: 'event-trigger', name: 'Blockchain Event', icon: Zap, description: 'Triggered by blockchain events' },
      { id: 'webhook-trigger', name: 'Webhook', icon: ArrowDown, description: 'Triggered by external webhook' },
      { id: 'price-trigger', name: 'Price Alert', icon: FileLineChart, description: 'Triggered by price changes' },
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    nodes: [
      { id: 'mysql', name: 'MySQL', icon: Database, description: 'Execute SQL queries' },
      { id: 'bridge', name: 'Bridge Assets', icon: Layers, description: 'Bridge assets between chains' },
      { id: 'person', name: 'Create Person', icon: User, description: 'Create a person record' },
      { id: 'contact', name: 'Create Contact', icon: User, description: 'Create a contact record' },
    ]
  },
  {
    id: 'utilities',
    name: 'Utilities',
    nodes: [
      { id: 'compare', name: 'Compare Datasets', icon: Compare, description: 'Compare two data inputs' },
      { id: 'date', name: 'Date & Time', icon: Calendar, description: 'Format date and time' },
      { id: 'set', name: 'Set Variable', icon: Edit, description: 'Set input variables' },
      { id: 'condition', name: 'Condition', icon: ArrowLeftRight, description: 'Add conditional logic' },
    ]
  },
];

// Template definitions with actual node data
const workflowTemplates = [
  {
    id: 'simple-swap',
    name: 'Simple Swap',
    icon: ArrowLeftRight,
    nodes: [
      { id: 'trigger-1', type: 'triggers', position: { x: 100, y: 100 }, data: { title: 'Schedule Trigger' } },
      { id: 'operation-1', type: 'operations', position: { x: 350, y: 100 }, data: { title: 'MySQL' } }
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' }
    ]
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline',
    icon: Database,
    nodes: [
      { id: 'trigger-1', type: 'triggers', position: { x: 100, y: 100 }, data: { title: 'Schedule Trigger' } },
      { id: 'operation-1', type: 'operations', position: { x: 350, y: 100 }, data: { title: 'MySQL' } },
      { id: 'utility-1', type: 'utilities', position: { x: 600, y: 100 }, data: { title: 'Compare Datasets' } }
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' },
      { id: 'connection-2', source: 'operation-1', target: 'utility-1' }
    ]
  },
  {
    id: 'person-flow',
    name: 'Person Pipeline',
    icon: User,
    nodes: [
      { id: 'trigger-1', type: 'triggers', position: { x: 100, y: 100 }, data: { title: 'Schedule Trigger' } },
      { id: 'operation-1', type: 'operations', position: { x: 350, y: 100 }, data: { title: 'Create Person' } },
      { id: 'utility-1', type: 'utilities', position: { x: 600, y: 100 }, data: { title: 'Set Variable' } }
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' },
      { id: 'connection-2', source: 'operation-1', target: 'utility-1' }
    ]
  }
];

export const NodePanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
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
  
  // Handle template click - dispatch event to parent
  const handleTemplateClick = (template: any) => {
    // Create a custom event that the workflow canvas will listen for
    const event = new CustomEvent('applyTemplate', { 
      detail: { template }
    });
    document.dispatchEvent(event);
    
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied to the canvas.`
    });
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
              {workflowTemplates.map(template => (
                <Button 
                  key={template.id}
                  variant="outline" 
                  className="w-full justify-start text-left hover:bg-white/5"
                  onClick={() => handleTemplateClick(template)}
                >
                  <template.icon className="h-4 w-4 mr-2" />
                  {template.name}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
