
export interface Transaction {
  id: string;
  type: 'swap' | 'bridge' | 'lend' | 'reward' | 'borrow' | 'withdraw' | 'stake';
  description: string;
  chain: string;
  time: string;
  amount: string;
  gas: string;
  status: 'success' | 'pending' | 'failed';
  hash: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "swap",
    description: "Swapped ETH for USDC",
    chain: "Arbitrum",
    time: "2025-04-25T10:30:00",
    amount: "1.5 ETH",
    gas: "0.002 ETH",
    status: "success",
    hash: "0x1234...5678"
  },
  {
    id: "tx-2",
    type: "bridge",
    description: "Bridged USDC to Optimism",
    chain: "Ethereum → Optimism",
    time: "2025-04-25T09:45:00",
    amount: "5000 USDC",
    gas: "0.004 ETH",
    status: "pending",
    hash: "0x8765...4321"
  },
  {
    id: "tx-3",
    type: "lend",
    description: "Supplied ETH to Aave",
    chain: "Ethereum",
    time: "2025-04-25T08:15:00",
    amount: "2.0 ETH",
    gas: "0.003 ETH",
    status: "success",
    hash: "0xabcd...efgh"
  },
  {
    id: "tx-4",
    type: "stake",
    description: "Staked ETH in Lido",
    chain: "Ethereum",
    time: "2025-04-24T23:20:00",
    amount: "5.0 ETH",
    gas: "0.002 ETH",
    status: "success",
    hash: "0x9876...5432"
  },
  {
    id: "tx-5",
    type: "reward",
    description: "Claimed staking rewards",
    chain: "Optimism",
    time: "2025-04-24T22:10:00",
    amount: "150 OP",
    gas: "0.001 ETH",
    status: "failed",
    hash: "0xijkl...mnop"
  }
];

// Adding the missing exports that are referenced in other files
export const transactionLogsData = [...mockTransactions];

export const recentActivityData = [
  {
    id: "ra-1",
    title: "Swapped ETH for USDC",
    description: "On Arbitrum",
    timestamp: "30 minutes ago",
    status: "success" as const
  },
  {
    id: "ra-2",
    title: "Bridged USDC to Optimism",
    description: "From Ethereum",
    timestamp: "45 minutes ago",
    status: "pending" as const
  },
  {
    id: "ra-3",
    title: "Supplied ETH to Aave",
    description: "On Ethereum",
    timestamp: "1 hour ago",
    status: "success" as const
  }
];

export const filterOptions = [
  { value: "all", label: "All Activities" },
  { value: "swap", label: "Swaps" },
  { value: "bridge", label: "Bridges" },
  { value: "lend", label: "Lending" },
  { value: "stake", label: "Staking" },
  { value: "reward", label: "Rewards" },
  { value: "borrow", label: "Borrowing" },
  { value: "withdraw", label: "Withdrawals" }
];
