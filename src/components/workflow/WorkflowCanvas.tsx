
import React, { useState, useRef, useEffect } from 'react';
import { Grid, ZoomIn, ZoomOut, MousePointer, Move, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

export const WorkflowCanvas = () => {
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTool, setCurrentTool] = useState<string>("select");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Listen for template application events
  useEffect(() => {
    const handleTemplateApply = (event: any) => {
      if (event.detail && event.detail.template) {
        const template = event.detail.template;
        
        if (template.nodes && template.nodes.length > 0) {
          // Apply the template nodes to the canvas
          setNodes(template.nodes.map((node: any) => ({
            ...node,
            id: `node-${node.id}-${Date.now()}`, // Ensure unique IDs
          })));
          
          toast({
            title: "Template Applied",
            description: `${template.name} template has been added to the canvas.`
          });
        }
      }
    };

    // Add event listener
    document.addEventListener('applyTemplate', handleTemplateApply);
    
    // Clean up
    return () => {
      document.removeEventListener('applyTemplate', handleTemplateApply);
    };
  }, [toast]);

  // Handle zoom in and out
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 20, 40));
  };

  // Handle drag over event (when dragging over the canvas)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle drop event (when dropping an item onto the canvas)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Get node data from the drag event
    const nodeType = e.dataTransfer.getData("node-type");
    const nodeTitle = e.dataTransfer.getData("node-title");
    
    if (!nodeType || !canvasRef.current) return;
    
    // Calculate position based on drop coordinates
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Adjust for canvas position and scroll
    const x = Math.round((e.clientX - rect.left) / 20) * 20;
    const y = Math.round((e.clientY - rect.top) / 20) * 20;
    
    // Create a new node with the dropped data
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position: { x, y },
      data: { title: nodeTitle }
    };
    
    setNodes(prev => [...prev, newNode]);
    
    toast({
      title: "Node Added",
      description: `${nodeTitle} node has been added to the workflow.`
    });
  };

  // Handle node selection
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
  };

  // Handle node dragging
  const handleNodeDragStart = (e: React.DragEvent<HTMLDivElement>, nodeId: string) => {
    e.dataTransfer.setData("node-id", nodeId);
    setIsDragging(true);
    if (currentTool === "select") {
      setSelectedNode(nodeId);
    }
  };

  // Handle node title update
  const handleTitleUpdate = (nodeId: string, newTitle: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, title: newTitle } }
          : node
      )
    );
  };

  // Handle node deletion
  const handleDeleteNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
    toast({
      title: "Node Deleted",
      description: "Node has been removed from the workflow."
    });
  };

  // Handle click on canvas background - deselect nodes
  const handleCanvasClick = () => {
    setSelectedNode(null);
  };

  // Add a predefined workflow template
  const addTemplate = () => {
    const templateNodes: Node[] = [
      {
        id: "node-1",
        type: "triggers",
        position: { x: 100, y: 100 },
        data: { title: "Price Alert" }
      },
      {
        id: "node-2",
        type: "operations",
        position: { x: 300, y: 100 },
        data: { title: "Token Swap" }
      },
      {
        id: "node-3",
        type: "utilities",
        position: { x: 500, y: 100 },
        data: { title: "Notification" }
      }
    ];
    
    setNodes(templateNodes);
    
    toast({
      title: "Template Added",
      description: "Basic workflow template has been added."
    });
  };

  // Render connection lines between nodes (placeholder for future implementation)
  const renderConnectionLines = () => {
    // In the future, we'll render connection lines between nodes here
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Tools */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant={currentTool === "select" ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1 h-8"
            onClick={() => setCurrentTool("select")}
          >
            <MousePointer className="h-3.5 w-3.5" />
            <span>Select</span>
          </Button>
          <Button 
            variant={currentTool === "move" ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1 h-8"
            onClick={() => setCurrentTool("move")}
          >
            <Move className="h-3.5 w-3.5" />
            <span>Move</span>
          </Button>
          <Button 
            variant={showGrid ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1 h-8"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Grid</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 h-8 ml-2"
            onClick={addTemplate}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Template</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="px-2 text-sm">{zoom}%</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div 
        className="flex-1 overflow-auto p-8 bg-background/50 relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div 
          ref={canvasRef}
          className={`h-full min-h-[800px] w-full relative ${showGrid ? 'bg-grid' : ''}`}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: '0 0',
          }}
          onClick={handleCanvasClick}
        >
          {/* Render connection lines */}
          {renderConnectionLines()}
          
          {/* Rendered Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute workflow-node rounded-md shadow-lg cursor-move ${
                selectedNode === node.id ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''
              } ${
                node.type === 'triggers' ? 'bg-blue-900/80 border-blue-600' : 
                node.type === 'operations' ? 'bg-green-900/80 border-green-600' : 
                'bg-purple-900/80 border-purple-600'
              } border`}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                minWidth: '180px',
                zIndex: selectedNode === node.id ? 20 : 10,
              }}
              onClick={(e) => handleNodeClick(node.id, e)}
              draggable
              onDragStart={(e) => handleNodeDragStart(e, node.id)}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className={`px-2 py-0.5 text-xs rounded ${
                    node.type === 'triggers' ? 'bg-blue-700/60 text-blue-100' : 
                    node.type === 'operations' ? 'bg-green-700/60 text-green-100' : 
                    'bg-purple-700/60 text-purple-100'
                  }`}>
                    {node.type.charAt(0).toUpperCase() + node.type.slice(1, -1)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10" 
                    onClick={(e) => handleDeleteNode(node.id, e)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <div className="font-medium text-sm text-white hover:underline cursor-pointer">
                      {node.data.title}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Edit Node</h4>
                      <div>
                        <label className="text-xs text-muted-foreground">Title</label>
                        <Input 
                          value={node.data.title} 
                          onChange={(e) => handleTitleUpdate(node.id, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="px-3 py-2 bg-black/20 text-xs text-white/70">
                Double-click to configure
              </div>
            </div>
          ))}
          
          {/* Empty State when no nodes */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <EmptyState
                title="Blockchain Workflow Builder"
                description="Drag and drop nodes from the left panel to build your workflow. Connect nodes to create an automated blockchain process."
                icon={<Grid className="h-12 w-12 opacity-30" />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
