
import { useState } from "react";
import { Terminal, LayoutDashboard, Code, Layers, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentSelector } from "@/components/playground/AgentSelector";
import { CommandInterface } from "@/components/playground/CommandInterface";

const Playground = () => {
  const [selectedAgent, setSelectedAgent] = useState("swap");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

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
            <a href="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </a>
            <a href="/playground" className="text-sm font-medium text-white flex items-center gap-1.5">
              <Terminal className="h-4 w-4" />
              Playground
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5">
              <Code className="h-4 w-4" />
              Agents
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Assets
            </a>
          </nav>
          <Button 
            variant="outline" 
            className="neumorphic-sm hover:bg-primary/5"
          >
            Connect Wallet
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            className="neumorphic-sm flex items-center gap-2 mb-4 hover:bg-primary/5"
            onClick={() => window.location.href = "/"}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            AI Playground
          </h1>
          <p className="text-muted-foreground mt-1">
            Execute smart transactions with natural language
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl neumorphic border-none bg-gradient-to-b from-background/95 to-background">
              <AgentSelector 
                selectedAgent={selectedAgent}
                onSelectAgent={setSelectedAgent}
              />
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <CommandInterface 
              selectedAgent={selectedAgent}
              isWalletConnected={isWalletConnected}
              onConnect={() => setIsWalletConnected(true)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Playground;
