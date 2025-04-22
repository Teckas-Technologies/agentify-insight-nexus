
import React from "react";
import { 
  ArrowLeftRight, 
  Layers, 
  ShieldPlus, 
  Gift, 
  DollarSign, 
  LogOut,
  ArrowRightLeft,
  Clock
} from "lucide-react";
import { transactionLogsData } from "@/data/mockData";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";

// Helper function to get the appropriate icon based on transaction type
const getTransactionIcon = (type: string) => {
  switch (type) {
    case "swap":
      return <ArrowLeftRight className="h-4 w-4" />;
    case "bridge":
      return <Layers className="h-4 w-4" />;
    case "lend":
      return <ShieldPlus className="h-4 w-4" />;
    case "reward":
      return <Gift className="h-4 w-4" />;
    case "borrow":
      return <DollarSign className="h-4 w-4" />;
    case "withdraw":
      return <LogOut className="h-4 w-4" />;
    case "stake":
      return <ArrowRightLeft className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export const TransactionLogs: React.FC<{ limit?: number }> = ({ limit = 5 }) => {
  // Get the most recent transactions up to the limit
  const transactions = transactionLogsData.slice(0, limit);

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between p-3 bg-card hover:bg-accent/10 rounded-md transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              {getTransactionIcon(tx.type)}
            </div>
            <div>
              <h4 className="text-sm font-medium">{tx.description}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tx.chain}</span>
                <span>•</span>
                <span>{format(new Date(tx.time), "MMM d, h:mm a")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{tx.amount}</span>
            <StatusBadge status={tx.status} />
          </div>
        </div>
      ))}
    </div>
  );
};
