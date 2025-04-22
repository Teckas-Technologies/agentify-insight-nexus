import { useState } from "react";
import { Terminal, LayoutDashboard, Code, Layers, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentSelector } from "@/components/playground/AgentSelector";
import { CommandInterface } from "@/components/playground/CommandInterface";

const Playground = () => {
  const [selectedAgent, setSelectedAgent] = useState("swap");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Agentify</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </a>
            <a href="/playground" className="text-sm font-medium text-white flex items-center gap-1.5">
              <Terminal className="h-4 w-4" />
              Playground
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Code className="h-4 w-4" />
              Agents
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Assets
            </a>
          </nav>
          <Button variant="outline" className="neumorphic-sm">
            Connect Wallet
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            className="neumorphic-sm flex items-center gap-2 mb-4"
            onClick={() => window.location.href = "/"}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">AI Playground</h1>
          <p className="text-muted-foreground mt-1">
            Interact with Agentify's AI agents through natural language commands
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-4">
            <AgentSelector 
              selectedAgent={selectedAgent}
              onSelectAgent={setSelectedAgent}
            />
          </div>
          
          {/* Right Panel */}
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
