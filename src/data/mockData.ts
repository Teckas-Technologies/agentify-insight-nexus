
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
