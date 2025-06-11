import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Grid, ZoomIn, ZoomOut, MousePointer, Move, Plus, ArrowRight, Trash2, Clock, CircleEqual, ArrowLeftRight, Zap, User, Edit, Search, Bell, Wallet, Check, Database, Globe, FileText, Upload, Download, Lock, Users, FileJson, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useToast } from '@/components/ui/use-toast';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

interface Node {
  id: string;
  type: string;
  position: { x: number, y: number };
  data: {
    title: string;
    params?: any;
  };
}

interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface WorkflowCanvasProps {
  onSelectNode: (node: Node | null) => void;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ onSelectNode, onUpdateNode, onDeleteNode }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string, handle: string } | null>(null);
  const [connectionPath, setConnectionPath] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<'select' | 'connect' | 'pan'>('select');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Handle node selection
  const handleNodeClick = (e: React.MouseEvent, node: Node) => {
    e.stopPropagation();
    if (mode === 'select') {
      setActiveNodeId(node.id);
      onSelectNode(node);
    }
  };
  
  // Handle background click to deselect
  const handleBackgroundClick = () => {
    setActiveNodeId(null);
    onSelectNode(null);
  };
  
  // Handle node drag
  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    if (mode !== 'select') return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    // Set the active node when starting to drag
    setActiveNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      onSelectNode(node);
    }
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              position: {
                x: node.position.x + (moveEvent.clientX - dragStart.x) / zoom,
                y: node.position.y + (moveEvent.clientY - dragStart.y) / zoom
              }
            };
          }
          return node;
        });
      });
      setDragStart({ x: moveEvent.clientX, y: moveEvent.clientY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle canvas panning
  const handleCanvasDragStart = (e: React.MouseEvent) => {
    if (mode !== 'pan') return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPan(prevPan => ({
        x: prevPan.x + (moveEvent.clientX - dragStart.x),
        y: prevPan.y + (moveEvent.clientY - dragStart.y)
      }));
      setDragStart({ x: moveEvent.clientX, y: moveEvent.clientY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle zoom in/out
  const handleZoom = (zoomIn: boolean) => {
    setZoom(prevZoom => {
      const newZoom = zoomIn ? prevZoom * 1.2 : prevZoom / 1.2;
      return Math.min(Math.max(newZoom, 0.5), 2);
    });
  };
  
  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom(prevZoom => {
        const newZoom = prevZoom * zoomFactor;
        return Math.min(Math.max(newZoom, 0.5), 2);
      });
    }
  };
  
  // Handle drag over for drop target
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  // Get node icon based on type - fixing the icon rendering
  const getNodeIcon = (type: string) => {
    const categoryType = type.split('-')[0];
    const specificType = type.split('-')[1] || '';

    if (categoryType === 'web3') {
      if (specificType === 'token') return <Wallet className="h-5 w-5" />;
      if (specificType === 'defi') return <ArrowLeftRight className="h-5 w-5" />;
      if (specificType === 'wallet') return <Wallet className="h-5 w-5" />;
      if (specificType === 'contract') return <FileText className="h-5 w-5" />;
      if (specificType === 'monitoring') return <Bell className="h-5 w-5" />;
      return <Zap className="h-5 w-5" />;
    }
    
    if (categoryType === 'web2') {
      if (specificType === 'social') return <User className="h-5 w-5" />;
      if (specificType === 'api') return <Globe className="h-5 w-5" />;
      if (specificType === 'time') return <Clock className="h-5 w-5" />;
      if (specificType === 'utilities') return <Edit className="h-5 w-5" />;
      return <Database className="h-5 w-5" />;
    }
    
    return <CircleEqual className="h-5 w-5" />;
  };
  
  // Handle connection start
  const handleConnectionStart = (e: React.MouseEvent, nodeId: string, handle: string) => {
    e.stopPropagation();
    setConnectionStart({ nodeId, handle });
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !connectionStart) return;
      
      const rect = canvas.getBoundingClientRect();
      const sourceNode = nodes.find(n => n.id === connectionStart.nodeId);
      
      if (!sourceNode) return;
      
      const startX = (sourceNode.position.x + NODE_WIDTH) * zoom + pan.x;
      const startY = (sourceNode.position.y + NODE_HEIGHT / 2) * zoom + pan.y;
      
      const endX = moveEvent.clientX - rect.left;
      const endY = moveEvent.clientY - rect.top;
      
      // Create a curved path
      const path = `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`;
      
      setConnectionPath(path);
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      setConnectionPath(null);
      
      if (!connectionStart) return;
      
      // Find if we're over a node's left handle (input)
      const targetElement = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
      const inputHandle = targetElement?.closest('.connection-point-left');
      
      if (inputHandle) {
        const targetNodeId = inputHandle.getAttribute('data-node-id');
        
        if (targetNodeId && targetNodeId !== connectionStart.nodeId) {
          // Create a new connection
          const newConnection: Connection = {
            id: `connection-${Date.now()}`,
            source: connectionStart.nodeId,
            target: targetNodeId
          };
          
          // Check if connection already exists
          const exists = connections.some(
            conn => conn.source === newConnection.source && conn.target === newConnection.target
          );
          
          if (!exists) {
            setConnections([...connections, newConnection]);
            toast({
              title: "Connection Created",
              description: "Nodes connected successfully"
            });
          }
        }
      }
      
      setConnectionStart(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Handle drop of new node from palette
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const nodeType = e.dataTransfer.getData("node-type");
    const nodeTitle = e.dataTransfer.getData("node-title");
    const nodeId = e.dataTransfer.getData("node-id");
    
    if (!nodeType || !nodeTitle) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    
    const newNode: Node = {
      id: `${nodeId}-${Date.now()}`,
      type: nodeType,
      position: { x, y },
      data: { title: nodeTitle }
    };
    
    setNodes([...nodes, newNode]);
    setActiveNodeId(newNode.id);
    onSelectNode(newNode);
    
    toast({
      title: "Node Added",
      description: `${nodeTitle} node added to workflow`
    });
  };
  
  // Apply a template to the canvas
  const applyTemplate = (template: any) => {
    if (!template || !template.nodes) return;
    
    // Clear current canvas
    setNodes(template.nodes);
    setConnections(template.connections || []);
    setActiveNodeId(null);
    onSelectNode(null);
  };
  
  // Calculate connection path
  const calculatePath = (source: Node, target: Node): string => {
    const startX = (source.position.x + NODE_WIDTH) * zoom + pan.x;
    const startY = (source.position.y + NODE_HEIGHT / 2) * zoom + pan.y;
    
    const endX = source.position.x < target.position.x 
      ? target.position.x * zoom + pan.x
      : (target.position.x + NODE_WIDTH) * zoom + pan.x;
      
    const endY = (target.position.y + NODE_HEIGHT / 2) * zoom + pan.y;
    
    // Create a curved path
    return `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`;
  };

  // Delete a connection
  const handleDeleteConnection = (connectionId: string) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.id !== connectionId)
    );
    
    toast({
      title: "Connection Removed",
      description: "Connection between nodes has been removed"
    });
  };

  // Listen for template application events
  useEffect(() => {
    const handleApplyTemplate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.template) {
        applyTemplate(customEvent.detail.template);
      }
    };
    
    document.addEventListener('applyTemplate', handleApplyTemplate);
    return () => {
      document.removeEventListener('applyTemplate', handleApplyTemplate);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="p-2 border-b border-white/10 bg-background/90 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            variant={mode === 'select' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setMode('select')}
            className="w-8 h-8"
            title="Select Mode"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button
            variant={mode === 'connect' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setMode('connect')}
            className="w-8 h-8"
            title="Connect Mode"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant={mode === 'pan' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setMode('pan')}
            className="w-8 h-8"
            title="Pan Mode"
          >
            <Move className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom(true)}
            className="w-8 h-8"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground mx-2">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom(false)}
            className="w-8 h-8"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="text-xs"
        >
          <Grid className="h-3.5 w-3.5 mr-1" />
          Reset View
        </Button>
      </div>
      
      {/* Canvas */}
      <div 
        className="flex-1 relative bg-grid overflow-hidden"
        onMouseDown={handleCanvasDragStart}
        onClick={handleBackgroundClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onWheel={handleWheel}
        ref={canvasRef}
        style={{ cursor: mode === 'pan' ? 'grab' : 'default' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Render nodes */}
          {nodes.map(node => {
            const isActive = node.id === activeNodeId;
            const nodeCategory = node.type.split('-')[0];
            
            return (
              <div
                key={node.id}
                className={`workflow-node absolute rounded-xl shadow-lg duration-100 ${
                  isActive ? 'ring-2 ring-primary shadow-xl' : ''
                } ${
                  nodeCategory === 'web3' 
                    ? 'bg-[#1E1E2E] border-l-4 border-l-cyan-500/70' 
                    : 'bg-[#1E1E1E] border-l-4 border-l-purple-500/70'
                }`}
                style={{
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                  left: node.position.x,
                  top: node.position.y,
                  zIndex: isActive ? 10 : 1,
                }}
                onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                onClick={(e) => handleNodeClick(e, node)}
              >
                <div className="flex flex-col h-full p-3 relative">
                  <div className="flex items-center mb-2">
                    <div className={`p-1.5 rounded-md mr-2 ${
                      nodeCategory === 'web3' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="font-medium text-sm truncate flex-1">{node.data.title}</span>
                    <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/70'
                    }`}>
                      {node.type.split('-')[1]}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 truncate">
                    {node.data.params 
                      ? Object.keys(node.data.params).length > 0 
                        ? `${Object.keys(node.data.params).length} parameter(s) configured` 
                        : 'No parameters configured'
                      : 'No parameters configured'
                    }
                  </div>
                  
                  {/* Input handle (left) */}
                  <div 
                    className="connection-point connection-point-left bg-white/10 hover:bg-primary hover:shadow-[0_0_10px_rgba(0,255,195,0.7)]" 
                    data-node-id={node.id}
                    data-handle="input"
                  />
                  
                  {/* Output handle (right) */}
                  <div 
                    className="connection-point connection-point-right bg-white/10 hover:bg-primary hover:shadow-[0_0_10px_rgba(0,255,195,0.7)]" 
                    data-node-id={node.id}
                    data-handle="output"
                    onMouseDown={(e) => mode === 'connect' && handleConnectionStart(e, node.id, 'output')}
                  />
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground">
              <EmptyState 
                title="Build Your Workflow"
                description="Drag nodes from the left panel to start building"
                icon={Plus}
              />
            </div>
          )}
        </div>
        
        {/* Connections between nodes (rendered in screen coordinates) */}
        <svg className="absolute inset-0 pointer-events-none">
          <defs>
            <marker 
              id="arrowhead" 
              markerWidth="10" 
              markerHeight="7" 
              refX="9" 
              refY="3.5" 
              orient="auto"
            >
              <polygon 
                points="0 0, 10 3.5, 0 7" 
                className="fill-cyan-400/70"
              />
            </marker>
          </defs>
          
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const path = calculatePath(sourceNode, targetNode);
            
            return (
              <g key={connection.id}>
                <path 
                  d={path}
                  className="connection-line stroke-cyan-400/70"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
                <path 
                  d={path}
                  className="connection-hitbox stroke-transparent"
                  strokeWidth="12"
                  fill="none"
                  onClick={() => handleDeleteConnection(connection.id)}
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                />
              </g>
            );
          })}
          
          {/* Temporary connection when dragging */}
          {connectionPath && (
            <path 
              d={connectionPath}
              className="connection-line"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              strokeDasharray="5,5"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

// Make sure we have a default export as well for backward compatibility
export default WorkflowCanvas;
