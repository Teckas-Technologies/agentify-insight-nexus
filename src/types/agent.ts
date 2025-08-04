
export interface AgentData {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: string[];
  tags: string[];
  gradient: string;
  supportedChains: string[];
  sampleCommands: string[];
  securityNotes: string;
  permissions: string[];
}

export interface AgentCategory {
  id: string;
  name: string;
}

export type UserData = {
  tasks: {
    telegram: boolean;
    twitter: boolean;
    discord: boolean;
    github: boolean;
  };
  _id: string;
  name: string; // optional if not required
  email: string; // optional if not required
  walletAddress: string;
  privyId: string;
  accumulatedPoints: number;
  referralCode: string;
  refferralsIds: string[];
  referredBy: string; // optional if not required
  transactions: number;
  transactionsPoints: number;
  totalVolume: string; // optional if not required
  reached10K: boolean;
  reached50K: boolean;
  reached100K: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  __v: number;
};
