
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface TipCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const TipCard = ({ 
  title, 
  description, 
  icon, 
  actionLabel = "Try Now", 
  onAction 
}: TipCardProps) => {
  return (
    <Card className="neumorphic border-none">
      <CardContent className="pt-6">
        {icon && <div className="mb-3 text-primary">{icon}</div>}
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
      {actionLabel && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full glow" 
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
