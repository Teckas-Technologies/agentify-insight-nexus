
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

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
    <Card className="neumorphic h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Execute Transactions with AI</h2>
          {!isWalletConnected ? (
            <Button onClick={onConnect} variant="outline" className="neumorphic-sm">
              Connect Wallet
            </Button>
          ) : (
            <Badge variant="outline">Wallet Connected</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="h-[calc(100vh-300px)] flex items-end">
          {/* Message history can be added here */}
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/5">
        <div className="flex w-full gap-3 items-center">
          <Badge variant="secondary" className="shrink-0">
            {selectedAgent.toUpperCase()} ASSISTANT
          </Badge>
          <div className="flex-1 flex gap-2">
            <Input 
              placeholder="Message Smart Actions..." 
              className="flex-1"
              disabled={!isWalletConnected}
            />
            <Button size="icon" disabled={!isWalletConnected}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
