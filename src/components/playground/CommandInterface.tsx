
import { Send, Wallet, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommandInterfaceProps {
  selectedAgent: string;
  isWalletConnected?: boolean;
  onConnect?: () => void;
}

export const CommandInterface = ({
  selectedAgent,
  isWalletConnected = false,
  onConnect = () => {}
}: CommandInterfaceProps) => {
  return (
    <Card className="neumorphic border-none h-full flex flex-col">
      <CardHeader className="border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Assistant</h2>
          </div>
          {!isWalletConnected ? (
            <Button 
              onClick={onConnect} 
              variant="outline" 
              className="neumorphic-sm flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          ) : (
            <Badge variant="secondary" className="px-3 py-1">
              Wallet Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-280px)] p-6">
          {!isWalletConnected ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mb-2 text-primary/20" />
              <h3 className="text-lg font-medium text-foreground">
                Welcome to Agentify AI Assistant
              </h3>
              <p className="max-w-sm text-sm">
                Connect your wallet to start executing smart transactions with natural language commands across any blockchain.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Message history will be added here */}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t border-white/5 p-4">
        <div className="flex w-full gap-3 items-center">
          <Badge 
            variant="outline" 
            className="bg-primary/5 border-primary/20 text-primary shrink-0"
          >
            {selectedAgent.toUpperCase()} AGENT
          </Badge>
          <div className="flex-1 flex gap-2">
            <Input 
              placeholder="Enter your command..." 
              className="flex-1 bg-background/50"
              disabled={!isWalletConnected}
            />
            <Button 
              size="icon" 
              className="shrink-0 neumorphic-sm"
              disabled={!isWalletConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
