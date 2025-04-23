
import { Activity } from "lucide-react";
import { EmptyState } from "../shared/EmptyState";

export const NoActivityState = () => {
  return (
    <EmptyState
      title="No Recent Activity"
      description="Your recent transactions and activities will appear here once you start using the platform."
      icon={<Activity className="h-12 w-12 text-muted-foreground/50" />}
    />
  );
};
