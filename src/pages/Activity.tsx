import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeftRight, 
  Layers, 
  ShieldPlus, 
  Gift, 
  DollarSign, 
  LogOut,
  ArrowRightLeft,
  Clock,
  Filter,
  ExternalLink
} from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { mockTransactions, filterOptions } from "@/data/activity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const ActivityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading] = useState(false);
  
  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.chain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "all" || tx.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Activity</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-background/50 border-white/10">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline-block">
                      {filterOptions.find(f => f.value === filterType)?.label || "All Activities"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-white/10">
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setFilterType(option.value)}
                      className={`cursor-pointer ${
                        filterType === option.value ? "bg-primary/10 text-white" : ""
                      }`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Transactions Table or Loading State or Empty State */}
          <Card className="neumorphic border-none">
            <CardContent>
              {isLoading ? (
                <LoadingSkeleton rows={5} />
              ) : filteredTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Gas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">TX Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="bg-primary/10 p-1 rounded-full mr-2 text-primary">
                              {getTransactionIcon(tx.type)}
                            </span>
                            <span className="capitalize">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>{tx.chain}</TableCell>
                        <TableCell>{format(new Date(tx.time), "MMM d, h:mm a")}</TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell>{tx.gas}</TableCell>
                        <TableCell>
                          <StatusBadge status={tx.status} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, "_blank")}
                          >
                            {tx.hash.slice(0, 6)}...
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState 
                  title="No transactions found" 
                  description="Try adjusting your search or filter criteria." 
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
