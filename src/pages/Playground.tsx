import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentSelector } from "@/components/playground/AgentSelector";
import { CommandInterface } from "@/components/playground/CommandInterface";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

const Playground = () => {
  const [selectedAgent, setSelectedAgent] = useState("swap");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            className="neumorphic-sm flex items-center gap-2 mb-4 hover:bg-primary/5"
            onClick={() => navigate('/')}
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
