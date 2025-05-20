import React, { useState } from 'react';
import { Search, ArrowLeftRight, Wallet, CircleEqual, Layers, ArrowDown, Clock, Zap, FileLineChart, Calendar, User, Edit, Plus, Minus, Settings, BarChart2, Activity, MessageSquare, Send, Code, Bell, DollarSign, FileJson, Mail, Database, Repeat, Tag, Check, Download, Upload, Users, Globe, FileText, Timer, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Node categories and their nodes
const nodeCategories = [
  {
    id: 'web3-token',
    name: 'Token Actions',
    category: 'web3',
    nodes: [
      { id: 'create-erc20', name: 'Create ERC-20 Token', icon: DollarSign, description: 'Deploy a new ERC-20 token' },
      { id: 'create-nft', name: 'Create NFT', icon: Tag, description: 'Deploy a new NFT collection' },
      { id: 'mint-tokens', name: 'Mint Tokens', icon: Plus, description: 'Mint new tokens to an address' },
      { id: 'transfer-tokens', name: 'Transfer Tokens', icon: Send, description: 'Transfer tokens between wallets' },
      { id: 'approve-spending', name: 'Approve Spending', icon: Check, description: 'Approve token spending' },
    ]
  },
  {
    id: 'web3-defi',
    name: 'DEX & DeFi',
    category: 'web3',
    nodes: [
      { id: 'swap-tokens', name: 'Swap Tokens', icon: ArrowLeftRight, description: 'Swap tokens on DEXes' },
      { id: 'add-liquidity', name: 'Add Liquidity', icon: Plus, description: 'Add liquidity to a pool' },
      { id: 'remove-liquidity', name: 'Remove Liquidity', icon: Minus, description: 'Remove liquidity from a pool' },
      { id: 'stake-tokens', name: 'Stake Tokens', icon: Lock, description: 'Stake tokens for rewards' },
      { id: 'claim-rewards', name: 'Claim Rewards', icon: DollarSign, description: 'Claim staking rewards' },
    ]
  },
  {
    id: 'web3-wallet',
    name: 'Wallet & Signing',
    category: 'web3',
    nodes: [
      { id: 'create-wallet', name: 'Create Wallet', icon: Wallet, description: 'Generate a new wallet' },
      { id: 'load-wallet', name: 'Load Wallet', icon: Download, description: 'Load an existing wallet' },
      { id: 'sign-message', name: 'Sign Message', icon: Edit, description: 'Sign a message with private key' },
      { id: 'send-transaction', name: 'Send Transaction', icon: Send, description: 'Send on-chain transaction' },
      { id: 'send-raw-tx', name: 'Send Raw TX', icon: Code, description: 'Send raw transaction bytes' },
    ]
  },
  {
    id: 'web3-contract',
    name: 'Smart Contract',
    category: 'web3',
    nodes: [
      { id: 'deploy-contract', name: 'Deploy Contract', icon: Upload, description: 'Deploy smart contract' },
      { id: 'read-contract', name: 'Read Contract', icon: Search, description: 'Call read-only contract method' },
      { id: 'write-contract', name: 'Write Contract', icon: Edit, description: 'Call state-changing contract method' },
      { id: 'monitor-events', name: 'Monitor Events', icon: Bell, description: 'Watch contract events' },
    ]
  },
  {
    id: 'web3-monitoring',
    name: 'Monitoring',
    category: 'web3',
    nodes: [
      { id: 'monitor-wallet', name: 'Monitor Wallet', icon: Wallet, description: 'Track wallet activity' },
      { id: 'monitor-token', name: 'Monitor Token Launch', icon: Zap, description: 'Track new token launches' },
      { id: 'monitor-gas', name: 'Monitor Gas Fees', icon: Activity, description: 'Track gas price changes' },
      { id: 'monitor-governance', name: 'Monitor Governance', icon: Users, description: 'Track governance proposals' },
    ]
  },
  {
    id: 'web2-social',
    name: 'Social & Alerts',
    category: 'web2',
    nodes: [
      { id: 'twitter-search', name: 'Twitter Search', icon: Search, description: 'Search Twitter for content' },
      { id: 'create-tweet', name: 'Create Tweet', icon: MessageSquare, description: 'Post a new tweet' },
      { id: 'telegram-message', name: 'Telegram Message', icon: Send, description: 'Send Telegram message' },
      { id: 'discord-webhook', name: 'Discord Webhook', icon: MessageSquare, description: 'Post to Discord' },
      { id: 'email-sender', name: 'Email Sender', icon: Mail, description: 'Send email via SMTP/SendGrid' },
    ]
  },
  {
    id: 'web2-api',
    name: 'API & Data',
    category: 'web2',
    nodes: [
      { id: 'http-request', name: 'HTTP Request', icon: Globe, description: 'Make HTTP API calls' },
      { id: 'graphql-request', name: 'GraphQL Request', icon: Database, description: 'Make GraphQL API calls' },
      { id: 'json-transformer', name: 'JSON Transformer', icon: FileJson, description: 'Transform JSON data' },
      { id: 'csv-parser', name: 'CSV Parser', icon: FileText, description: 'Parse and transform CSV' },
    ]
  },
  {
    id: 'web2-time',
    name: 'Time & Events',
    category: 'web2',
    nodes: [
      { id: 'cron-trigger', name: 'Cron Trigger', icon: Clock, description: 'Schedule recurring workflows' },
      { id: 'delay-node', name: 'Delay Node', icon: Timer, description: 'Wait before continuing' },
      { id: 'webhook-trigger', name: 'Webhook Trigger', icon: ArrowDown, description: 'Triggered by webhook' },
      { id: 'webhook-response', name: 'Webhook Response', icon: ArrowUp, description: 'Respond to webhook' },
    ]
  },
  {
    id: 'web2-utilities',
    name: 'Utilities',
    category: 'web2',
    nodes: [
      { id: 'if-switch', name: 'IF / SWITCH', icon: ArrowLeftRight, description: 'Conditional branching' },
      { id: 'loop-split', name: 'Loop / Split', icon: Repeat, description: 'Loop through items' },
      { id: 'set-variable', name: 'Set Variable', icon: Edit, description: 'Set workflow variable' },
      { id: 'format-validate', name: 'Format / Validate', icon: Check, description: 'Format or validate data' },
    ]
  },
];

// Template definitions with actual node data
const workflowTemplates = [
  {
    id: 'token-swap',
    name: 'Token Swap',
    icon: ArrowLeftRight,
    nodes: [
      { id: 'trigger-1', type: 'web3-wallet', position: { x: 100, y: 100 }, data: { title: 'Load Wallet', params: { privateKey: '{{ENV.WALLET_KEY}}' } } },
      { id: 'operation-1', type: 'web3-defi', position: { x: 350, y: 100 }, data: { title: 'Swap Tokens', params: { tokenIn: 'USDT', tokenOut: 'ETH', amount: 100, slippage: 0.5 } } }
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' }
    ]
  },
  {
    id: 'monitor-alert',
    name: 'Price Monitor & Alert',
    icon: Bell,
    nodes: [
      { id: 'trigger-1', type: 'web3-monitoring', position: { x: 100, y: 100 }, data: { title: 'Monitor Token Launch', params: { chain: 'ethereum', tokenSymbol: 'ETH' } } },
      { id: 'operation-1', type: 'web2-social', position: { x: 350, y: 100 }, data: { title: 'Telegram Message', params: { message: 'Token price alert: {{data.price}}' } } },
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' }
    ]
  },
  {
    id: 'auto-buy',
    name: 'Auto-Buy on Launch',
    icon: Zap,
    nodes: [
      { id: 'trigger-1', type: 'web3-monitoring', position: { x: 100, y: 100 }, data: { title: 'Monitor Token Launch' } },
      { id: 'operation-1', type: 'web3-wallet', position: { x: 350, y: 100 }, data: { title: 'Load Wallet' } },
      { id: 'operation-2', type: 'web3-defi', position: { x: 600, y: 100 }, data: { title: 'Swap Tokens' } }
    ],
    connections: [
      { id: 'connection-1', source: 'trigger-1', target: 'operation-1' },
      { id: 'connection-2', source: 'operation-1', target: 'operation-2' }
    ]
  }
];

export const NodePanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { toast } = useToast();
  
  // Filter nodes based on search term and active category
  const filteredNodes = nodeCategories.flatMap(category => {
    return category.nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (activeCategory === 'all' || 
       activeCategory === 'web3' && category.category === 'web3' || 
       activeCategory === 'web2' && category.category === 'web2')
    );
  });

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, node: any, category: string) => {
    e.dataTransfer.setData("node-type", category);
    e.dataTransfer.setData("node-title", node.name);
    e.dataTransfer.setData("node-id", node.id);
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
        category.includes('web3') ? 'bg-cyan-500/10 text-cyan-500' : 
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
        <h2 className="text-lg font-semibold mb-4">Workflow Nodes</h2>
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
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="web3" className="flex-1">Web3</TabsTrigger>
            <TabsTrigger value="web2" className="flex-1">Web2</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {searchTerm || activeCategory !== 'all' ? (
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
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      category.category === 'web3' ? 'bg-cyan-500' : 'bg-purple-500'
                    }`}></span>
                    {category.name}
                  </h3>
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
