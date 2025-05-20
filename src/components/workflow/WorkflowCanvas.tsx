
import React, { useState, useRef, useEffect } from 'react';
import { Grid, ZoomIn, ZoomOut, MousePointer, Move, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useToast } from '@/components/ui/use-toast';

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  // Add a predefined workflow template
  const addTemplate = () => {
    const templateNodes: Node[] = [
      {
        id: "node-1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: { title: "Price Alert" }
      },
      {
        id: "node-2",
        type: "operation",
        position: { x: 300, y: 100 },
        data: { title: "Token Swap" }
      },
      {
        id: "node-3",
        type: "utility",
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
        >
          {/* Rendered Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute p-3 rounded-lg shadow-md cursor-move ${
                node.type === 'trigger' ? 'bg-blue-100 border-blue-300' : 
                node.type === 'operation' ? 'bg-green-100 border-green-300' : 
                'bg-purple-100 border-purple-300'
              } border-2`}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                zIndex: 10,
              }}
            >
              <div className="font-medium text-sm">{node.data.title}</div>
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
