
import { Activity as ActivityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { transactionLogsData } from "@/data/mockData";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const ActivityPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">Activity Log</h1>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>

          {/* Transaction Table */}
          <Card className="neumorphic border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionLogsData.slice(0, 10).map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="capitalize">{tx.type}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>{tx.chain}</TableCell>
                      <TableCell>{format(new Date(tx.time), "MMM d, h:mm a")}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
