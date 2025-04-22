
import { useState } from "react";
import { Terminal, LayoutDashboard, Code, Layers, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Playground = () => {
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

        <Card className="neumorphic border-none mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Command Interface</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-16">
            <div className="text-center">
              <Terminal className="h-16 w-16 text-primary/70 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Command Interface</h2>
              <p className="text-muted-foreground mb-4 max-w-md">
                This is where you would interact with the AI agents through natural language commands.
                The input interface would be designed here.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Playground;
