
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

interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export const WorkflowCanvas = () => {
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTool, setCurrentTool] = useState<string>("select");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{nodeId: string, handle?: string} | null>(null);
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
          
          // If the template has connections, apply those too
          if (template.connections && template.connections.length > 0) {
            setConnections(template.connections.map((connection: any) => ({
              ...connection,
              id: `connection-${connection.id}-${Date.now()}`,
            })));
          }
          
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
    // Delete any connections that involve this node
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.source !== nodeId && conn.target !== nodeId)
    );
    
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
    if (isCreatingConnection) {
      setIsCreatingConnection(false);
      setConnectionStart(null);
    }
  };

  // Start creating a connection
  const handleConnectionStart = (nodeId: string, handle?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsCreatingConnection(true);
    setConnectionStart({ nodeId, handle });
  };

  // Complete connection creation
  const handleConnectionEnd = (nodeId: string, handle?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!connectionStart || connectionStart.nodeId === nodeId) {
      setIsCreatingConnection(false);
      setConnectionStart(null);
      return;
    }
    
    // Create a new connection
    const newConnection: Connection = {
      id: `connection-${Date.now()}`,
      source: connectionStart.nodeId,
      target: nodeId,
      sourceHandle: connectionStart.handle,
      targetHandle: handle,
    };
    
    setConnections(prev => [...prev, newConnection]);
    setIsCreatingConnection(false);
    setConnectionStart(null);
    
    toast({
      title: "Connection Created",
      description: "Nodes have been connected successfully."
    });
  };

  // Delete a connection
  const handleDeleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    
    toast({
      title: "Connection Deleted",
      description: "Connection has been removed from the workflow."
    });
  };

  // Add a predefined workflow template
  const addTemplate = () => {
    const templateNodes: Node[] = [
      {
        id: "node-1",
        type: "triggers",
        position: { x: 100, y: 100 },
        data: { title: "Schedule Trigger" }
      },
      {
        id: "node-2",
        type: "operations",
        position: { x: 300, y: 100 },
        data: { title: "MySQL" }
      },
      {
        id: "node-3",
        type: "utilities",
        position: { x: 500, y: 100 },
        data: { title: "Compare Datasets" }
      }
    ];
    
    const templateConnections: Connection[] = [
      {
        id: "connection-1",
        source: "node-1",
        target: "node-2"
      },
      {
        id: "connection-2",
        source: "node-2",
        target: "node-3"
      }
    ];
    
    setNodes(templateNodes);
    setConnections(templateConnections);
    
    toast({
      title: "Template Added",
      description: "Basic workflow template has been added."
    });
  };

  // Calculate connection line path
  const calculateConnectionPath = (connection: Connection) => {
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    
    if (!sourceNode || !targetNode) return '';
    
    // Get source and target positions
    const sourceX = sourceNode.position.x + 180; // Right side of source node
    const sourceY = sourceNode.position.y + 30; // Center of source node
    const targetX = targetNode.position.x; // Left side of target node
    const targetY = targetNode.position.y + 30; // Center of target node
    
    // Calculate control points for the bezier curve
    const controlPointX1 = sourceX + 50;
    const controlPointX2 = targetX - 50;
    
    // Create a bezier curve path
    return `M ${sourceX} ${sourceY} C ${controlPointX1} ${sourceY}, ${controlPointX2} ${targetY}, ${targetX} ${targetY}`;
  };

  // Render connection lines between nodes
  const renderConnectionLines = () => {
    return connections.map(connection => {
      const path = calculateConnectionPath(connection);
      
      return (
        <g key={connection.id} className="connection-group">
          <path
            d={path}
            className="connection-line"
            stroke="#666"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          <path
            d={path}
            className="connection-hitbox"
            stroke="transparent"
            strokeWidth="10"
            fill="none"
            onClick={() => handleDeleteConnection(connection.id)}
          />
        </g>
      );
    });
  };

  // Get icon for node type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'triggers':
        return <Clock className="h-5 w-5" />;
      case 'operations':
        return <Database className="h-5 w-5" />;
      case 'utilities':
        return <ArrowRight className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
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
          {/* SVG for connections */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            <defs>
              <marker 
                id="arrowhead" 
                markerWidth="6" 
                markerHeight="6" 
                refX="5" 
                refY="3" 
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="#666" />
              </marker>
            </defs>
            {/* Render connection lines */}
            {renderConnectionLines()}
          </svg>
          
          {/* Rendered Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute workflow-node rounded-md shadow-lg cursor-move ${
                selectedNode === node.id ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''
              } ${
                node.type === 'triggers' ? 'bg-white border-blue-300' : 
                node.type === 'operations' ? 'bg-white border-green-300' : 
                'bg-white border-purple-300'
              } border`}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                width: '180px',
                zIndex: selectedNode === node.id ? 20 : 10,
              }}
              onClick={(e) => handleNodeClick(node.id, e)}
              draggable
              onDragStart={(e) => handleNodeDragStart(e, node.id)}
            >
              <div className="p-3">
                {/* Node Header with Icon */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-md ${
                    node.type === 'triggers' ? 'bg-blue-500/10 text-blue-500' : 
                    node.type === 'operations' ? 'bg-green-500/10 text-green-500' : 
                    'bg-purple-500/10 text-purple-500'
                  }`}>
                    {getNodeIcon(node.type)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-500 hover:text-red-500 hover:bg-white/10" 
                    onClick={(e) => handleDeleteNode(node.id, e)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Node Title */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="font-medium text-sm text-black hover:underline cursor-pointer">
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
                
                {/* Node Description */}
                <div className="text-xs text-gray-500 mt-1">
                  {node.type === 'triggers' ? 'Start your workflow' : 
                   node.type === 'operations' ? 'Process or transform data' : 
                   'Utility operation'}
                </div>
              </div>
              
              {/* Connection Points */}
              <div 
                className="connection-point connection-point-right"
                onClick={(e) => handleConnectionStart(node.id, 'right', e)}
              />
              <div 
                className="connection-point connection-point-left"
                onClick={(e) => handleConnectionEnd(node.id, 'left', e)}
              />
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
