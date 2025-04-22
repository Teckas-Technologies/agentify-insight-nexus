
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
              Automate Your Web3 Operations with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Deploy intelligent agents to handle your DeFi operations, token swaps, and cross-chain transactions with natural language commands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 glow"
                asChild
              >
                <Link to="/playground">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 neumorphic-sm hover:bg-primary/5"
                asChild
              >
                <Link to="/agents">
                  View Agents
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl neumorphic">
            <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 w-fit mb-4">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Natural Language Commands</h3>
            <p className="text-muted-foreground">
              Control your DeFi operations using simple English commands. No coding required.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl neumorphic">
            <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 w-fit mb-4">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Multi-Chain Support</h3>
            <p className="text-muted-foreground">
              Execute operations across multiple blockchains seamlessly and securely.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl neumorphic">
            <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 w-fit mb-4">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Automated DeFi</h3>
            <p className="text-muted-foreground">
              Set up automated strategies for swaps, bridges, and yield farming.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
            Ready to Transform Your DeFi Experience?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of users who are already automating their Web3 operations.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 glow"
            asChild
          >
            <Link to="/playground">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
