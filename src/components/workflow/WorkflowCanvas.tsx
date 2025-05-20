
import React from 'react';
import { Grid, ZoomIn, ZoomOut, MousePointer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const WorkflowCanvas = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Canvas Tools */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
            <MousePointer className="h-3.5 w-3.5" />
            <span>Select</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
            <Grid className="h-3.5 w-3.5" />
            <span>Show Grid</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="px-2 text-sm">100%</span>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8 bg-background/50">
        <div className="h-full min-h-[800px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Grid className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium">Blockchain Workflow Builder</h3>
            <p className="max-w-md mt-2 text-sm">
              Drag and drop nodes from the left panel to build your workflow.
              Connect nodes to create an automated blockchain process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
