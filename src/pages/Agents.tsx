import { useState } from "react";
import { Terminal, Search, Filter, ArrowRight } from "lucide-react";
import AgentCard from "@/components/agents/AgentCard";
import { AgentCategory, AgentData } from "@/types/agent";
import SearchAndFilter from "@/components/agents/SearchAndFilter";
import { Link } from "react-router-dom";

// Sample agent data
const agentsData: AgentData[] = [
  {
    id: "swap",
    name: "Swap Assistant",
    description: "Execute token swaps across any DEX with smart routing and optimal rates",
    icon: "ArrowLeftRight",
    categories: ["DeFi"],
    tags: ["Multi-chain", "Auto Route", "Fee Optimized"],
    gradient: "from-violet-500/20 via-fuchsia-500/20 to-violet-500/20",
    supportedChains: ["Ethereum", "Arbitrum", "Optimism", "Polygon", "Base"],
    sampleCommands: [
      "Swap 0.1 ETH to USDC on Arbitrum",
      "Find the best rate to swap 500 USDC to wBTC",
      "Swap 100 USDT to DAI with max 0.5% slippage"
    ],
    securityNotes: "Requires token approvals for DEX contracts. Uses secure routes with trusted protocols.",
    permissions: ["Connect wallet", "Token approvals", "Transaction signing"]
  },
  {
    id: "bridge",
    name: "Bridge Assistant",
    description: "Bridge tokens between networks with cost-effective routes and gas estimations",
    icon: "Layers",
    categories: ["Cross-chain", "DeFi"],
    tags: ["Cross-chain", "Gas Optimized", "Auto Route"],
    gradient: "from-cyan-500/20 via-blue-500/20 to-cyan-500/20",
    supportedChains: ["Ethereum", "Arbitrum", "Optimism", "Polygon", "Base", "Avalanche"],
    sampleCommands: [
      "Bridge 0.5 ETH from Ethereum to Arbitrum",
      "What's the cheapest way to bridge 1000 USDC to Optimism?",
      "Bridge 50 MATIC from Polygon to Ethereum"
    ],
    securityNotes: "Uses official bridge contracts and trusted aggregators for secure cross-chain transfers.",
    permissions: ["Connect wallet", "Token approvals", "Transaction signing"]
  },
  {
    id: "lend",
    name: "Lend & Borrow Assistant",
    description: "Manage lending positions across protocols with interest rate tracking and health monitoring",
    icon: "Zap",
    categories: ["DeFi"],
    tags: ["Multi-protocol", "Interest Optimized", "Risk Monitoring"],
    gradient: "from-amber-500/20 via-orange-500/20 to-amber-500/20",
    supportedChains: ["Ethereum", "Arbitrum", "Optimism", "Polygon"],
    sampleCommands: [
      "Supply 1000 USDC to Aave on Arbitrum",
      "What's my current health factor on Compound?",
      "Borrow 500 DAI against my ETH collateral"
    ],
    securityNotes: "Interacts with established lending protocols with audited smart contracts.",
    permissions: ["Connect wallet", "Token approvals", "Transaction signing"]
  },
  {
    id: "stake",
    name: "Staking Assistant",
    description: "Stake tokens and claim rewards with automated compounding and yield tracking",
    icon: "Star",
    categories: ["DeFi", "Tools"],
    tags: ["Auto-compound", "Reward Tracking", "APR Optimization"],
    gradient: "from-green-500/20 via-emerald-500/20 to-green-500/20",
    supportedChains: ["Ethereum", "Arbitrum", "Optimism", "Polygon"],
    sampleCommands: [
      "Stake 10 ETH in Lido",
      "Claim my rewards from Aave staking",
      "What's the current APR for staking SNX?"
    ],
    securityNotes: "Only interacts with reputable staking protocols with proven security track records.",
    permissions: ["Connect wallet", "Token approvals", "Transaction signing"]
  },
  {
    id: "monitor",
    name: "Price Monitor",
    description: "Set price alerts and monitor token values with customizable thresholds and notifications",
    icon: "LineChart",
    categories: ["Tools"],
    tags: ["Alerts", "No Gas Fees", "Customizable"],
    gradient: "from-purple-500/20 via-violet-500/20 to-purple-500/20",
    supportedChains: ["All chains"],
    sampleCommands: [
      "Alert me when ETH goes above $4000",
      "Track BTC/ETH ratio and notify me if it drops below 13",
      "Set daily price updates for my portfolio"
    ],
    securityNotes: "View-only tool that doesn't require transaction signing. Uses aggregated price feeds.",
    permissions: ["Connect wallet (optional)", "Notification permissions"]
  },
  {
    id: "nft",
    name: "NFT Assistant",
    description: "Browse, buy, and manage NFTs across marketplaces with floor price tracking",
    icon: "Image",
    categories: ["NFT"],
    tags: ["Multi-marketplace", "Floor Analysis", "Rarity Check"],
    gradient: "from-pink-500/20 via-rose-500/20 to-pink-500/20",
    supportedChains: ["Ethereum", "Polygon", "Base", "Optimism"],
    sampleCommands: [
      "Show me the floor price for Bored Apes",
      "Buy the cheapest Azuki below 10 ETH",
      "List my NFT on OpenSea and Blur"
    ],
    securityNotes: "Interacts with established NFT marketplaces. Verifies contract addresses against trusted sources.",
    permissions: ["Connect wallet", "NFT approvals", "Transaction signing"]
  }
];

const categories: AgentCategory[] = [
  { id: "all", name: "All Agents" },
  { id: "DeFi", name: "DeFi" },
  { id: "NFT", name: "NFT" },
  { id: "Tools", name: "Tools" },
  { id: "Cross-chain", name: "Cross-chain" }
];

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredAgents = agentsData.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                            agent.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
              Agentify
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/agents" className="text-sm font-medium text-white">
              Agents
            </Link>
            <Link to="/playground" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Playground
            </Link>
            <Link to="/activity" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Activity
            </Link>
          </nav>
          <button className="neumorphic-sm hover:bg-primary/5 py-2 px-4 rounded-lg text-sm font-medium border border-white/5 transition-all">
            Connect Wallet
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Browse Agents
            </h1>
            <p className="text-muted-foreground mt-1">
              Pick an agent. Give it a task. Let it work for you.
            </p>
          </div>
          
          <SearchAndFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
          
          {filteredAgents.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-muted/20 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No agents found</h3>
              <p className="text-muted-foreground max-w-md">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          )}
        </div>
        
        {/* Bottom section - Build Your Own Agent */}
        <div className="mt-16 p-8 rounded-xl neumorphic border-none bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-2">
                Build Your Own Agent?
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Create custom agents tailored to your specific needs with the Agentify Developer Framework. 
                Design, test, and deploy your AI agents in minutes.
              </p>
            </div>
            <button className="glow neumorphic-sm hover:bg-primary/10 py-3 px-6 rounded-lg text-white font-medium border border-primary/20 flex items-center gap-2 transition-all">
              Start Building
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentsPage;
