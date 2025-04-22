export const executionSummaryData = {
  commandsExecuted: 238,
  mostUsedAgent: "Swap Agent",
  tokensSwapped: "$45,384.21",
  chainsInteracted: 5,
};

export const recentActivityData = [
  {
    id: 1,
    title: "Swapped ETH to USDC",
    description: "0.5 ETH to 942.32 USDC on Arbitrum",
    timestamp: "2 minutes ago",
    status: "success" as const,
  },
  {
    id: 2,
    title: "Bridged USDT to Optimism",
    description: "500 USDT from Ethereum to Optimism",
    timestamp: "35 minutes ago",
    status: "success" as const,
  },
  {
    id: 3,
    title: "Supplied USDC to Aave",
    description: "1000 USDC supplied on Arbitrum",
    timestamp: "1 hour ago",
    status: "pending" as const,
  },
  {
    id: 4,
    title: "Swapped USDC to wBTC",
    description: "2000 USDC to 0.037 wBTC on Polygon",
    timestamp: "3 hours ago",
    status: "success" as const,
  },
  {
    id: 5,
    title: "Claimed rewards from staking",
    description: "23.5 OP tokens claimed on Optimism",
    timestamp: "5 hours ago",
    status: "failed" as const,
  },
  {
    id: 6,
    title: "Borrowed DAI against ETH",
    description: "500 DAI borrowed on Ethereum",
    timestamp: "1 day ago",
    status: "success" as const,
  },
];

export const savedCommandsData = [
  {
    id: 1,
    title: "ETH to USDC Swap",
    command: "swap 0.1 ETH to USDC on Arbitrum",
  },
  {
    id: 2,
    title: "Bridge to Optimism",
    command: "bridge 100 USDC to Optimism",
  },
  {
    id: 3,
    title: "Lend on Aave",
    command: "lend 500 USDC on Arbitrum Aave",
  },
];

export const agentUsageData = [
  { name: "Swap", value: 62, color: "hsl(262, 83.3%, 57.8%)" },
  { name: "Bridge", value: 26, color: "hsl(12, 76.4%, 64.7%)" },
  { name: "Lend/Borrow", value: 12, color: "hsl(142, 76.2%, 36.3%)" },
];

export const chainActivityData = [
  { name: "Arbitrum", count: 58 },
  { name: "Polygon", count: 42 },
  { name: "Optimism", count: 37 },
  { name: "Ethereum", count: 26 },
  { name: "Base", count: 15 },
];

export const gasUsageData = {
  totalGas: "0.138 ETH",
  avgGas: "0.0006 ETH",
};

export const gasHistoryData = [
  { name: "Mon", value: 0.0004 },
  { name: "Tue", value: 0.0007 },
  { name: "Wed", value: 0.0009 },
  { name: "Thu", value: 0.0005 },
  { name: "Fri", value: 0.0006 },
  { name: "Sat", value: 0.0008 },
  { name: "Sun", value: 0.0004 },
];

export const tipsData = [
  {
    id: 1,
    title: "Try Staking with Agentify",
    description: "Earn passive income by staking your assets with our Staking Agent",
  },
  {
    id: 2,
    title: "Multi-Chain Swapping",
    description: "Save gas by using our optimized multi-chain swap routes",
  },
  {
    id: 3,
    title: "Custom Agent Flows",
    description: "Create custom agent flows to automate your DeFi strategies",
  },
];

export const transactionLogsData = [
  {
    id: "tx-1",
    type: "swap",
    description: "Swapped 0.5 ETH to 942.32 USDC",
    chain: "Arbitrum",
    time: "2025-04-22T08:30:00",
    amount: "0.5 ETH",
    status: "success" as const,
    hash: "0x3a8d...b4e2",
    gas: "0.0015 ETH",
  },
  {
    id: "tx-2",
    type: "bridge",
    description: "Bridged 500 USDT from Ethereum to Optimism",
    chain: "Ethereum → Optimism",
    time: "2025-04-21T14:15:00",
    amount: "500 USDT",
    status: "success" as const,
    hash: "0x7c2e...9f01",
    gas: "0.0032 ETH",
  },
  {
    id: "tx-3",
    type: "lend",
    description: "Supplied 1000 USDC to Aave",
    chain: "Arbitrum",
    time: "2025-04-21T09:45:00",
    amount: "1000 USDC",
    status: "pending" as const,
    hash: "0x5d1a...2c18",
    gas: "0.0009 ETH",
  },
  {
    id: "tx-4",
    type: "swap",
    description: "Swapped 2000 USDC to 0.037 wBTC",
    chain: "Polygon",
    time: "2025-04-20T17:20:00",
    amount: "2000 USDC",
    status: "success" as const,
    hash: "0x91f4...8a76",
    gas: "0.0004 MATIC",
  },
  {
    id: "tx-5",
    type: "reward",
    description: "Claimed 23.5 OP tokens from staking",
    chain: "Optimism",
    time: "2025-04-20T11:35:00",
    amount: "23.5 OP",
    status: "failed" as const,
    hash: "0xe67b...3d92",
    gas: "0.0001 ETH",
  },
  {
    id: "tx-6",
    type: "borrow",
    description: "Borrowed 500 DAI against ETH collateral",
    chain: "Ethereum",
    time: "2025-04-19T13:50:00",
    amount: "500 DAI",
    status: "success" as const,
    hash: "0x2c8d...f7e4",
    gas: "0.0028 ETH",
  },
  {
    id: "tx-7",
    type: "swap",
    description: "Swapped 100 USDC to 100 BUSD",
    chain: "BSC",
    time: "2025-04-19T10:25:00",
    amount: "100 USDC",
    status: "success" as const,
    hash: "0x8a3f...c6b2",
    gas: "0.0003 BNB",
  },
  {
    id: "tx-8",
    type: "bridge",
    description: "Bridged 1.5 ETH from Ethereum to Arbitrum",
    chain: "Ethereum → Arbitrum",
    time: "2025-04-18T16:40:00",
    amount: "1.5 ETH",
    status: "success" as const,
    hash: "0xf19a...7e2d",
    gas: "0.0045 ETH",
  },
  {
    id: "tx-9",
    type: "stake",
    description: "Staked 50 MATIC in validator",
    chain: "Polygon",
    time: "2025-04-18T09:15:00",
    amount: "50 MATIC",
    status: "success" as const,
    hash: "0x4d7e...9c35",
    gas: "0.0006 MATIC",
  },
  {
    id: "tx-10",
    type: "withdraw",
    description: "Withdrew 500 USDC from Aave",
    chain: "Arbitrum",
    time: "2025-04-17T14:30:00",
    amount: "500 USDC",
    status: "pending" as const,
    hash: "0xb23a...5f81",
    gas: "0.0008 ETH",
  },
];
