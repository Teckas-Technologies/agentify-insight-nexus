import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  Mail, 
  Trophy, 
  Users, 
  ExternalLink, 
  Copy, 
  Star,
  TrendingUp,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { transactionLogsData } from "@/data/activity";

const socialTasks = [
  {
    id: "telegram",
    name: "Join Telegram",
    points: 100,
    icon: "📱",
    link: "https://t.me/example",
    completed: false
  },
  {
    id: "twitter",
    name: "Follow on X",
    points: 50,
    icon: "🐦",
    link: "https://twitter.com/example",
    completed: false
  },
  {
    id: "discord",
    name: "Join Discord",
    points: 100,
    icon: "💬",
    link: "https://discord.gg/example",
    completed: false
  },
  {
    id: "github",
    name: "Star on GitHub",
    points: 75,
    icon: "⭐",
    link: "https://github.com/example",
    completed: false
  }
];

const volumeBonuses = [
  { threshold: 10000, bonus: 500, label: "10K Volume Bonus", achieved: false },
  { threshold: 50000, bonus: 1000, label: "50K Volume Bonus", achieved: false },
  { threshold: 100000, bonus: 2500, label: "100K Volume Bonus", achieved: false }
];

export default function DApp() {
  const [isConnected, setIsConnected] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [userVolume, setUserVolume] = useState(0);
  const [referralCode] = useState("DAPP-REF-123456");
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: "Wallet Connected!",
      description: "Welcome to the DApp. Start earning points now!",
    });
  };

  const handleSocialTask = (taskId: string, points: number, link: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      setUserPoints(prev => prev + points);
      toast({
        title: "Points Earned!",
        description: `+${points} points for completing social task`,
      });
    }
    window.open(link, '_blank');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://dapp.example.com/ref/${referralCode}`);
    toast({
      title: "Referral Link Copied!",
      description: "Share with friends to earn more points",
    });
  };

  const totalTransactionPoints = transactionLogsData.length * 50;
  const totalPoints = userPoints + totalTransactionPoints;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                DApp Rewards
              </h1>
              {isConnected && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {totalPoints.toLocaleString()} Points
                </Badge>
              )}
            </div>
            {!isConnected && (
              <div className="flex gap-2">
                <Button onClick={handleConnect} className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
                <Button variant="outline" onClick={handleConnect} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Sign Up with Email
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          // Pre-connection landing
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Welcome to DApp Rewards</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect your wallet or sign up with email to start earning points through social engagement, 
                transactions, and referrals. Unlock exclusive rewards as you grow!
              </p>
            </div>
            
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Get Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleConnect} size="lg" className="w-full flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
                <Button onClick={handleConnect} variant="outline" size="lg" className="w-full flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Sign Up with Email
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Connected user dashboard
          <div className="space-y-6">
            {/* Points Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                      <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction Volume</p>
                      <p className="text-2xl font-bold">${userVolume.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Referrals</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Social Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Social Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socialTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{task.icon}</span>
                        <div>
                          <p className="font-medium">{task.name}</p>
                          <p className="text-sm text-muted-foreground">+{task.points} points</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={completedTasks.includes(task.id) ? "secondary" : "default"}
                        onClick={() => handleSocialTask(task.id, task.points, task.link)}
                        disabled={completedTasks.includes(task.id)}
                      >
                        {completedTasks.includes(task.id) ? "Completed" : "Join"}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Agent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Earn 50 points per transaction
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {transactionLogsData.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.chain}</p>
                        </div>
                        <Badge variant="secondary">+50 pts</Badge>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Total Transaction Points: <span className="font-bold">{totalTransactionPoints}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Volume Bonuses */}
            <Card>
              <CardHeader>
                <CardTitle>Volume Bonuses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {volumeBonuses.map((bonus, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        bonus.achieved ? "bg-primary/10 border-primary" : "bg-muted/20"
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-medium">{bonus.label}</p>
                        <p className="text-2xl font-bold text-primary">+{bonus.bonus} pts</p>
                        <p className="text-sm text-muted-foreground">
                          ${bonus.threshold.toLocaleString()} volume
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Referral Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Referral Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Share your referral link and earn 100 points for each friend who joins and completes their first transaction.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-muted rounded border text-sm font-mono">
                    https://dapp.example.com/ref/{referralCode}
                  </div>
                  <Button onClick={copyReferralLink} size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}