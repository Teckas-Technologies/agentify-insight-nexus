
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChainBadge } from "@/components/dashboard/ChainBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

// Mock transaction data based on your schema
const mockTransactions = [
  {
    _id: "6810bfdbcdc9910a421fc194",
    user_id: "did:privy:cm9ww3tnr00l0l80moslr5v4a",
    agent_id: "swapAgent",
    transaction_type: "SWAP",
    description: "ETH to USDT",
    chain: "Ethereum",
    time: "2025-04-29T12:02:35.869Z",
    crypto: "ETH",
    amount: 0.01,
    transaction_hash: "0xhash50",
    status: "SUCCESS",
    amountUSD: 15,
    gasUSD: 0.5,
    agent_name: "Swap Agent"
  },
  {
    _id: "6810bfdbcdc9910a421fc195",
    user_id: "did:privy:cm9ww3tnr00l0l80moslr5v4b",
    agent_id: "bridgeAgent",
    transaction_type: "BRIDGE",
    description: "USDC Bridge to Arbitrum",
    chain: "Arbitrum",
    time: "2025-04-29T11:45:22.123Z",
    crypto: "USDC",
    amount: 100,
    transaction_hash: "0xhash51",
    status: "PENDING",
    amountUSD: 100,
    gasUSD: 2.1,
    agent_name: "Bridge Agent"
  },
  {
    _id: "6810bfdbcdc9910a421fc196",
    user_id: "did:privy:cm9ww3tnr00l0l80moslr5v4c",
    agent_id: "lendAgent",
    transaction_type: "LEND",
    description: "Supply USDT to Aave",
    chain: "Polygon",
    time: "2025-04-29T10:30:15.456Z",
    crypto: "USDT",
    amount: 500,
    transaction_hash: "0xhash52",
    status: "SUCCESS",
    amountUSD: 500,
    gasUSD: 0.05,
    agent_name: "Lending Agent"
  },
  {
    _id: "6810bfdbcdc9910a421fc197",
    user_id: "did:privy:cm9ww3tnr00l0l80moslr5v4d",
    agent_id: "swapAgent",
    transaction_type: "SWAP",
    description: "MATIC to USDC",
    chain: "Polygon",
    time: "2025-04-29T09:15:45.789Z",
    crypto: "MATIC",
    amount: 50,
    transaction_hash: "0xhash53",
    status: "FAILED",
    amountUSD: 45,
    gasUSD: 0.08,
    agent_name: "Swap Agent"
  }
];

export const TransactionTable = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const truncateUserId = (userId: string) => {
    return `${userId.slice(0, 12)}...`;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Chain</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Gas Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTransactions.map((tx) => (
            <TableRow key={tx._id}>
              <TableCell>
                <div>
                  <div className="font-medium">{tx.description}</div>
                  <Badge variant="outline" className="text-xs">
                    {tx.transaction_type}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs">{truncateUserId(tx.user_id)}</span>
              </TableCell>
              <TableCell>
                <div className="text-sm">{tx.agent_name}</div>
              </TableCell>
              <TableCell>
                <ChainBadge chain={tx.chain} />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">${tx.amountUSD}</div>
                  <div className="text-xs text-muted-foreground">
                    {tx.amount} {tx.crypto}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">${tx.gasUSD}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={tx.status.toLowerCase() as "success" | "pending" | "failed"} />
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {formatDate(tx.time)}
                </span>
              </TableCell>
              <TableCell>
                <a 
                  href="#" 
                  className="font-mono text-xs text-primary hover:underline"
                  title={tx.transaction_hash}
                >
                  {truncateHash(tx.transaction_hash)}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
