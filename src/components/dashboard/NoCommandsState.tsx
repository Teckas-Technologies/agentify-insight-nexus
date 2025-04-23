
import { FileText } from "lucide-react";
import { EmptyState } from "../shared/EmptyState";

export const NoCommandsState = () => {
  return (
    <EmptyState
      title="No Saved Commands"
      description="Your frequently used and saved commands will appear here."
      icon={<FileText className="h-12 w-12 text-muted-foreground/50" />}
    />
  );
};
