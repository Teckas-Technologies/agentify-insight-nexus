
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, Play, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ConfigPanelProps {
  selectedNode: any;
  onUpdateNodeData: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const ConfigPanel = ({ selectedNode, onUpdateNodeData, onDeleteNode }: ConfigPanelProps) => {
  const [formValues, setFormValues] = useState<any>({});
  const { toast } = useToast();

  React.useEffect(() => {
    if (selectedNode) {
      setFormValues(selectedNode.data.params || {});
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col border-l border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold mb-2">Node Configuration</h2>
          <p className="text-sm text-muted-foreground">Select a node to configure its parameters</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-muted-foreground">
            <p>No node selected</p>
            <p className="text-xs mt-2">Click on a node in the canvas to configure it</p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveConfig = () => {
    onUpdateNodeData(selectedNode.id, {
      ...selectedNode.data,
      params: formValues,
    });

    toast({
      title: "Configuration Saved",
      description: `Updated settings for ${selectedNode.data.title}`,
    });
  };

  const handleTestNode = () => {
    toast({
      title: "Node Test Started",
      description: "Running test execution of this node...",
    });
    
    // Mock test execution with success after 1 second
    setTimeout(() => {
      toast({
        title: "Node Test Complete",
        description: "Test execution completed successfully",
      });
    }, 1000);
  };

  const handleDeleteNode = () => {
    onDeleteNode(selectedNode.id);
    toast({
      title: "Node Deleted",
      description: `Removed ${selectedNode.data.title} from the workflow`,
    });
  };

  // Helper function to generate form fields based on node type
  const renderConfigFields = () => {
    const nodeType = selectedNode.type;
    
    // Web3 token nodes
    if (nodeType === 'web3-token') {
      return (
        <>
          <div className="mb-4">
            <Label htmlFor="tokenSymbol">Token Symbol</Label>
            <Input 
              id="tokenSymbol"
              value={formValues.tokenSymbol || ''}
              onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
              placeholder="e.g. ETH, BTC"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount"
              type="number"
              value={formValues.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
              placeholder="0.0"
              className="bg-white/5 border-white/10"
            />
          </div>
        </>
      );
    }
    
    // DEX & DeFi nodes
    if (nodeType === 'web3-defi') {
      return (
        <>
          <div className="mb-4">
            <Label htmlFor="tokenIn">From Token</Label>
            <Select 
              value={formValues.tokenIn || ''} 
              onValueChange={(value) => handleInputChange('tokenIn', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10">
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="DAI">DAI</SelectItem>
                <SelectItem value="WBTC">WBTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="tokenOut">To Token</Label>
            <Select 
              value={formValues.tokenOut || ''} 
              onValueChange={(value) => handleInputChange('tokenOut', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10">
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="DAI">DAI</SelectItem>
                <SelectItem value="WBTC">WBTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount"
              type="number"
              value={formValues.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
              placeholder="0.0"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="slippage">Slippage (%)</Label>
            <Input 
              id="slippage"
              type="number"
              value={formValues.slippage || ''}
              onChange={(e) => handleInputChange('slippage', parseFloat(e.target.value))}
              placeholder="0.5"
              className="bg-white/5 border-white/10"
            />
          </div>
        </>
      );
    }

    // Wallet & Signing nodes
    if (nodeType === 'web3-wallet') {
      return (
        <>
          <div className="mb-4">
            <Label htmlFor="privateKey">Private Key</Label>
            <Input 
              id="privateKey"
              value={formValues.privateKey || ''}
              onChange={(e) => handleInputChange('privateKey', e.target.value)}
              placeholder="0x..."
              className="bg-white/5 border-white/10"
              type="password"
            />
            <p className="text-xs text-muted-foreground mt-1">Use environment variables for production</p>
          </div>
          <div className="mb-4">
            <Label htmlFor="network">Network</Label>
            <Select 
              value={formValues.network || ''} 
              onValueChange={(value) => handleInputChange('network', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10">
                <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="goerli">Goerli Testnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );
    }

    // Smart Contract nodes
    if (nodeType === 'web3-contract') {
      return (
        <>
          <div className="mb-4">
            <Label htmlFor="contractAddress">Contract Address</Label>
            <Input 
              id="contractAddress"
              value={formValues.contractAddress || ''}
              onChange={(e) => handleInputChange('contractAddress', e.target.value)}
              placeholder="0x..."
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="methodName">Method Name</Label>
            <Input 
              id="methodName"
              value={formValues.methodName || ''}
              onChange={(e) => handleInputChange('methodName', e.target.value)}
              placeholder="e.g. balanceOf"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="params">Parameters (JSON)</Label>
            <Textarea 
              id="params"
              value={formValues.params ? JSON.stringify(formValues.params, null, 2) : ''}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleInputChange('params', parsed);
                } catch {
                  // Allow invalid JSON during editing
                  handleInputChange('params', e.target.value);
                }
              }}
              placeholder='[{"address": "0x..."}, 123]'
              className="bg-white/5 border-white/10 font-mono h-20"
            />
          </div>
        </>
      );
    }

    // Web2 Social & Alerts nodes
    if (nodeType === 'web2-social') {
      return (
        <>
          <div className="mb-4">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message"
              value={formValues.message || ''}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Your message content"
              className="bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey"
              value={formValues.apiKey || ''}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="Your API key"
              className="bg-white/5 border-white/10"
              type="password"
            />
            <p className="text-xs text-muted-foreground mt-1">Use environment variables for production</p>
          </div>
        </>
      );
    }

    // API & Data nodes
    if (nodeType === 'web2-api') {
      return (
        <>
          <div className="mb-4">
            <Label htmlFor="url">URL</Label>
            <Input 
              id="url"
              value={formValues.url || ''}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://api.example.com/data"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="method">Method</Label>
            <Select 
              value={formValues.method || ''} 
              onValueChange={(value) => handleInputChange('method', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10">
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="headers">Headers (JSON)</Label>
            <Textarea 
              id="headers"
              value={formValues.headers ? JSON.stringify(formValues.headers, null, 2) : ''}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleInputChange('headers', parsed);
                } catch {
                  // Allow invalid JSON during editing
                  handleInputChange('headers', e.target.value);
                }
              }}
              placeholder='{"Content-Type": "application/json"}'
              className="bg-white/5 border-white/10 font-mono h-20"
            />
          </div>
        </>
      );
    }

    // Time & Events nodes
    if (nodeType === 'web2-time') {
      return (
        <>
          <div className="mb-4">
            <Label htmlFor="schedule">Schedule (Cron)</Label>
            <Input 
              id="schedule"
              value={formValues.schedule || ''}
              onChange={(e) => handleInputChange('schedule', e.target.value)}
              placeholder="* * * * *"
              className="bg-white/5 border-white/10"
            />
            <p className="text-xs text-muted-foreground mt-1">Cron expression (e.g. "0 9 * * *" for daily at 9am)</p>
          </div>
          <div className="mb-4">
            <Label htmlFor="timezone">Timezone</Label>
            <Select 
              value={formValues.timezone || ''} 
              onValueChange={(value) => handleInputChange('timezone', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10">
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">America/New_York</SelectItem>
                <SelectItem value="Europe/London">Europe/London</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );
    }

    // Default fields for any node type
    return (
      <>
        <div className="mb-4">
          <Label htmlFor="nodeName">Node Name</Label>
          <Input 
            id="nodeName"
            value={selectedNode.data.title || ''}
            onChange={(e) => onUpdateNodeData(selectedNode.id, { ...selectedNode.data, title: e.target.value })}
            placeholder="Enter node name"
            className="bg-white/5 border-white/10"
          />
        </div>
        <div className="mb-4">
          <Label>Generic Parameters</Label>
          <div className="text-xs text-muted-foreground mt-1 mb-2">
            This node type doesn't have specific configuration fields.
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="h-full flex flex-col border-l border-white/10">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">{selectedNode.data.title || 'Configure Node'}</h2>
        <p className="text-sm text-muted-foreground">Edit node parameters</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <form className="space-y-4">
          {renderConfigFields()}

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <pre className="text-xs font-mono bg-black/20 p-3 rounded-md overflow-x-auto">
                {JSON.stringify(formValues || {}, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </form>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteNode}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestNode}
          >
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
          <Button
            size="sm"
            onClick={handleSaveConfig}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
