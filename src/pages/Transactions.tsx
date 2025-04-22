
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  ExternalLink,
  Filter
} from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { transactionLogsData } from "@/data/mockData";
import { format } from "date-fns";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

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

const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter transactions based on search query
  const filteredTransactions = transactionLogsData.filter(tx => 
    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.chain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Transaction Logs</h1>
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
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <Card className="neumorphic border-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold">All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
