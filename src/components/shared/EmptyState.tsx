
import { MessageSquareOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const EmptyState = ({ 
  title = "No transactions yet",
  description = "When you make transactions, they will appear here.",
  ctaText,
  ctaLink
}: EmptyStateProps) => {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
      <MessageSquareOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {ctaText && ctaLink && (
        <Button asChild>
          <Link to={ctaLink}>{ctaText}</Link>
        </Button>
      )}
    </Card>
  );
};

