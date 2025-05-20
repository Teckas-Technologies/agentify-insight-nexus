
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Terminal, LayoutDashboard, Workflow, Activity, Layers, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";

const Navbar: React.FC = () => {
  // For demo purposes - in a real app this would be managed through a context or state management
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnectWallet = () => {
    setIsConnected(true);
  };

  return (
    <header className="px-6 py-4 border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
            Agentify Flow
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" icon={LayoutDashboard}>
            Dashboard
          </NavLink>
          <NavLink to="/workflow-builder" icon={Workflow}>
            Workflows
          </NavLink>
          <NavLink to="/activity" icon={Activity}>
            Activity
          </NavLink>
          <NavLink to="/agents" icon={Layers}>
            Modules
          </NavLink>
        </nav>
        <Button 
          variant="outline" 
          className="neumorphic-sm hover:bg-primary/5"
          onClick={handleConnectWallet}
        >
          {isConnected ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Connected
            </span>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
