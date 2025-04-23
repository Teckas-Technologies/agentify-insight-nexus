
import { MessageSquareOff } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState = ({ 
  title = "No transactions yet",
  description = "When you make transactions, they will appear here."
}: EmptyStateProps) => {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
      <MessageSquareOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </Card>
  );
};
