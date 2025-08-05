import { useEffect, useState, useRef, useCallback } from "react";
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
  Gift,
  CheckCircle,
  Loader2,
  RefreshCw,
  CopyIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { transactionLogsData } from "@/data/activity";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAccount } from "wagmi";
import { UserData } from "@/types/agent";
import { telegramVerificationService } from "@/services/telegramVerification";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

/**
 * POINTS CONFIGURATION
 * Central configuration for all point values in the DApp.
 * Modify these values to adjust the entire points economy.
 */
export const POINTS_CONFIG = {
  // Transaction & Referral Points
  TRANSACTION: 20,      // Points per transaction
  REFERRAL: 5,          // Points per successful referral

  // Volume Milestone Points (one-time bonuses)
  VOLUME_10K: 40,       // Bonus for reaching $10K volume
  VOLUME_50K: 150,      // Bonus for reaching $50K volume
  VOLUME_100K: 300,     // Bonus for reaching $100K volume

  // Social Task Points (one-time rewards)
  TELEGRAM: 10,        // Join Telegram channel
  TWITTER: 10,          // Follow on Twitter/X
  DISCORD: 10,         // Join Discord server
  GITHUB: 5,           // Star GitHub repository
};

// Maintain backward compatibility
const TRANSACTION_POINTS = POINTS_CONFIG.TRANSACTION;
const REFERRAL_POINT = POINTS_CONFIG.REFERRAL;
const REACHED_10K_POINTS = POINTS_CONFIG.VOLUME_10K;
const REACHED_50K_POINTS = POINTS_CONFIG.VOLUME_50K;
const REACHED_100K_POINTS = POINTS_CONFIG.VOLUME_100K;
const TELEGRAM_POINTS = POINTS_CONFIG.TELEGRAM;
const TWITTER_POINTS = POINTS_CONFIG.TWITTER;
const DISCORD_POINTS = POINTS_CONFIG.DISCORD;
const GITHUB_POINTS = POINTS_CONFIG.GITHUB;

// Utility function to calculate points dynamically
export const calculatePoints = {
  transaction: (count: number) => count * POINTS_CONFIG.TRANSACTION,
  referral: (count: number) => count * POINTS_CONFIG.REFERRAL,
  volumeBonus: (volume: number) => {
    let bonus = 0;
    if (volume >= 100000) bonus += POINTS_CONFIG.VOLUME_100K;
    else if (volume >= 50000) bonus += POINTS_CONFIG.VOLUME_50K;
    else if (volume >= 10000) bonus += POINTS_CONFIG.VOLUME_10K;
    return bonus;
  },
  social: (taskId: string) => {
    switch (taskId) {
      case 'telegram': return POINTS_CONFIG.TELEGRAM;
      case 'twitter': return POINTS_CONFIG.TWITTER;
      case 'discord': return POINTS_CONFIG.DISCORD;
      case 'github': return POINTS_CONFIG.GITHUB;
      default: return 0;
    }
  }
};

const socialTasks = [
  {
    id: "telegram",
    name: "Join Telegram",
    points: TELEGRAM_POINTS,
    icon: "📱",
    link: "https://t.me/agentifyHQ",
    completed: false
  },
  {
    id: "twitter",
    name: "Follow on X",
    points: TWITTER_POINTS,
    icon: "🐦",
    link: "https://x.com/agentifyxyz",
    completed: false
  },
  {
    id: "refer",
    name: "Refer a friend",
    points: REFERRAL_POINT,
    icon: "💬",
    link: "https://app.agentifyai.xyz",
    completed: false
  },
  // {
  //   id: "discord",
  //   name: "Join Discord",
  //   points: DISCORD_POINTS,
  //   icon: "💬",
  //   link: "https://discord.gg/example",
  //   completed: false
  // },
  // {
  //   id: "github",
  //   name: "Star on GitHub",
  //   points: GITHUB_POINTS,
  //   icon: "⭐",
  //   link: "https://github.com/example",
  //   completed: false
  // }
];

const volumeBonuses = [
  { threshold: 10000, bonus: REACHED_10K_POINTS, label: "10K Volume Bonus", achieved: false },
  { threshold: 50000, bonus: REACHED_50K_POINTS, label: "50K Volume Bonus", achieved: false },
  { threshold: 100000, bonus: REACHED_100K_POINTS, label: "100K Volume Bonus", achieved: false }
];

export default function DApp() {
  const [isConnected, setIsConnected] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [userVolume, setUserVolume] = useState(0);
  const [loggedinUserId, setLoggedInUserId] = useState("");
  const [userData, setUserData] = useState<UserData>(null);
  const [verifyingTasks, setVerifyingTasks] = useState<{ [key: string]: boolean }>({});
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [transactionVolume, setTransactionVolume] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMoreTx, setIsLoadingMoreTx] = useState(false);
  const [hasMoreTx, setHasMoreTx] = useState(true);
  const txObserverTarget = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { connectWallet, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { createUser, getUserByPrivyId, completeTask } = useOnboarding();
  const { handleWalletConnect, disconnectAll } = useWalletConnect();
  const { user } = usePrivy();
  const { address } = useAccount();
  const { getstats, getTransactions } = useTransactions();

  const getStatics = async () => {
    const res = await getstats(address, user?.id);
    console.log("User Stats:", res);
    setTransactionVolume(res?.stats?.transactionVolume || 0);
    return res;
  }

  const getTransactionData = async (isLoadMore = false) => {
    if (isLoadMore && (!hasMoreTx || isLoadingMoreTx)) return;
    
    if (isLoadMore) {
      setIsLoadingMoreTx(true);
    }
    
    const skip = isLoadMore ? currentPage * 10 : 0;
    const res = await getTransactions(address, user?.id, skip, 10);
    console.log("User Transactions:", res);
    
    const responseData = res?.data?.data || [];
    const newTransactions = responseData.data || responseData || [];
    const totalPages = responseData.totalPages || res?.data?.totalPages || 1;
    const currentPageFromAPI = responseData.currentPage || res?.data?.currentPage || 1;
    
    if (isLoadMore) {
      // Always add new transactions, even if there's only 1
      if (newTransactions.length > 0) {
        setTransactions(prev => [...prev, ...newTransactions]);
        setCurrentPage(prev => prev + 1);
      }
      
      // Check if we've reached the last page based on API response
      if (currentPage + 1 >= totalPages || newTransactions.length === 0) {
        setHasMoreTx(false);
      }
      
      setIsLoadingMoreTx(false);
    } else {
      // Initial load
      setTransactions(newTransactions);
      setCurrentPage(1);
      // Set hasMoreTx based on total pages from API
      setHasMoreTx(totalPages > 1);
    }
    
    return res;
  };

  const refreshAllData = async () => {
    if (user?.id) {
      setIsLoadingPoints(true);
      await getStatics();
      await getTransactionData();
      setTimeout(() => {
        fetchUserData();
      }, 1000);
    }
  };

  const params = new URLSearchParams(window.location.search);
  const referredBy = params.get('ref');

  console.log("Address", address);
  console.log("User", user);
  console.log("ReferredBy", referredBy);

  const handleConnect = () => {
    if (!user) { // !address ||
      handleWalletConnect();
    } else {
      disconnectAll();
    }
  };

  useEffect(() => {
    if (user && user?.id) {
      setIsConnected(true);
      console.log("Wallet connected: ", wallets);
      toast({
        title: "Wallet Connected!",
        description: "Welcome to the DApp. Start earning points now!",
      });
      // Fetch data in sequence to ensure proper initialization
      const initializeUserData = async () => {
        setIsLoadingPoints(true);
        await onboardUser();
        // Fetch transactions and stats first
        await getStatics();
        await getTransactionData();
        // Then fetch user data with a delay to ensure backend has processed everything
        setTimeout(() => {
          fetchUserData();
        }, 1500);
      };
      initializeUserData();
      checkTelegramStatus();
    } else {
      setIsConnected(false);
    }
  }, [user])

  // Remove duplicate calls since they're now handled in the initialization
  // This effect is kept empty but can be used for other user-dependent operations if needed
  useEffect(() => {
    // Handled in the initialization useEffect above
  }, [user]);

  useEffect(() => {
    if (user && (transactions.length > 0 || transactionVolume > 0)) {
      // Add a small delay to ensure backend has processed the transaction points
      setIsLoadingPoints(true);
      const timer = setTimeout(() => {
        fetchUserData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [transactions.length, transactionVolume])

  // Intersection observer for infinite scroll
  useEffect(() => {
    const loadMoreTransactions = () => {
      if (!isLoadingMoreTx && hasMoreTx && user?.id) {
        getTransactionData(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreTransactions();
        }
      },
      { threshold: 0.1 }
    );

    if (txObserverTarget.current) {
      observer.observe(txObserverTarget.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMoreTx, hasMoreTx, user, currentPage]);

  const onboardUser = async () => {
    console.log("Onboarding user with ID:", user.id);
    if (referredBy) {
      const result = await createUser({ privyId: user.id, referredBy: referredBy });
      console.log("User created with referral:", result);
    } else {
      const result = await createUser({ privyId: user.id });
      console.log("User created without referral:", result);
    }
  }

  const fetchUserData = async () => {
    if (user?.id) {
      const userData = await getUserByPrivyId(user.id);
      if (userData) {
        console.log("Fetched user data:", userData);
        console.log("Tasks data:", userData?.data?.tasks);
        console.log("Completed tasks data:", userData?.data?.completedTasks);
        setUserData(userData?.data);

        // Check completed tasks
        const completed = [];

        // Check both possible data structures
        const tasks = userData?.data?.tasks || {};
        const completedTasks = userData?.data?.completedTasks || {};

        // Check tasks structure
        if (tasks.telegram || completedTasks.telegram) completed.push('telegram');
        if (tasks.twitter || completedTasks.twitter) completed.push('twitter');
        if (tasks.discord || completedTasks.discord) completed.push('discord');
        if (tasks.github || completedTasks.github) completed.push('github');

        console.log("Setting completed tasks:", completed);
        setCompletedTasks(completed);

        // Update points
        if (userData?.data?.accumulatedPoints) {
          setUserPoints(userData.data.accumulatedPoints);
        }
        setIsLoadingPoints(false);
      }
    }
  }

  const checkTelegramStatus = async () => {
    if (user?.id) {
      const BACKEND_SERVER_URL = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/telegram/status/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setTelegramConnected(data.connected);
          if (data.verified && !completedTasks.includes('telegram')) {
            setCompletedTasks(prev => [...prev, 'telegram']);
          }
        }
      } catch (error) {
        console.error('Failed to check Telegram status:', error);
      }
    }
  }

  const handleSocialTask = async (taskId: string, points: number, link: string) => {
    if (!user?.id) {
      toast({
        title: "Connect Wallet First",
        description: "Please connect your wallet to earn points",
        variant: "destructive",
      });
      return;
    }

    if (completedTasks.includes(taskId)) {
      console.log("Task already completed:", taskId);
      window.open(link, '_blank');
      return;
    }

    console.log("Task not completed yet:", taskId, "Current completed tasks:", completedTasks);

    // Special handling for referral task
    if (taskId === 'refer') {
      const referralLink = `https://app.agentifyai.xyz?ref=${userData?.referralCode || user?.id?.replace("did:privy:", "")}`;
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Referral Link Copied!",
        description: "Share with friends to earn points when they join and complete tasks",
      });
      return;
    }

    // Special handling for Telegram verification
    // if (taskId === 'telegram') {
    //   console.log("Starting Telegram verification for user:", user.id);
    //   setVerifyingTasks(prev => ({ ...prev, telegram: true }));

    //   try {
    //     // Open the Telegram bot with user's Privy ID for authentication
    //     const authLink = telegramVerificationService.generateTelegramAuthLink(user.id);
    //     console.log("Opening bot authentication link:", authLink);
    //     console.log("Your Privy ID:", user.id);
    //     window.open(authLink, '_blank');

    //     toast({
    //       title: "Authenticate with Our Bot",
    //       description: `1. Click 'START' in the bot 2. Send: /start ${user.id} 3. Bot will give you channel link 4. Join channel 5. Come back here for verification`,
    //     });

    //     // Start background verification polling after user has time to authenticate and join
    //     let attempts = 0;
    //     const maxAttempts = 24; // Check for 4 minutes (every 10 seconds)

    //     const pollForMembership = async () => {
    //       attempts++;
    //       console.log(`Verification attempt ${attempts}/${maxAttempts}`);

    //       try {
    //         // Check if user has completed the authentication and channel join process
    //         const statusData = await telegramVerificationService.checkUserStatus(user.id);
    //         console.log("Status check result:", statusData);

    //         if (statusData.connected && statusData.verified) {
    //             // User has already been verified by the bot
    //             await completeTask({
    //               taskName: 'telegram',
    //               identifier: user.id
    //             });

    //             setCompletedTasks(prev => [...prev, taskId]);
    //             setUserPoints(prev => prev + points);
    //             await fetchUserData();

    //             toast({
    //               title: "Verification Successful!",
    //               description: `+${points} points for joining Telegram channel`,
    //             });

    //             setVerifyingTasks(prev => ({ ...prev, telegram: false }));
    //             return;
    //           } else if (statusData.connected) {
    //             // User is connected to bot but hasn't joined channel yet, continue polling
    //             toast({
    //               title: "Waiting for Channel Join",
    //               description: "Please join the channel using the link from our bot",
    //             });
    //           }

    //         // Continue polling if not verified and haven't reached max attempts
    //         if (attempts < maxAttempts) {
    //           setTimeout(pollForMembership, 10000); // Check again in 10 seconds
    //         } else {
    //           // Max attempts reached
    //           toast({
    //             title: "Verification Timeout",
    //             description: `Please ensure you've sent /start ${user.id} to the bot and joined the channel, then try again.`,
    //             variant: "destructive",
    //           });
    //           setVerifyingTasks(prev => ({ ...prev, telegram: false }));
    //         }
    //       } catch (error) {
    //         console.error('Verification polling error:', error);
    //         if (attempts >= maxAttempts) {
    //           toast({
    //             title: "Verification Error",
    //             description: "Failed to verify membership. Please try again later.",
    //             variant: "destructive",
    //           });
    //           setVerifyingTasks(prev => ({ ...prev, telegram: false }));
    //         } else {
    //           // Continue trying
    //           setTimeout(pollForMembership, 10000);
    //         }
    //       }
    //     };

    //     // Start first check after 10 seconds (give user time to authenticate)
    //     setTimeout(pollForMembership, 10000)

    //   } catch (error) {
    //     console.error('Telegram verification error:', error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to open Telegram channel. Please try again.",
    //       variant: "destructive",
    //     });
    //     setVerifyingTasks(prev => ({ ...prev, telegram: false }));
    //   }
    //   return;
    // } else {
    // For other social tasks, open link and mark as completed
    // In production, you'd implement similar verification for each platform
    window.open(link, '_blank');

    try {
      await completeTask({
        taskName: taskId as any,
        identifier: user.id
      });

      setCompletedTasks(prev => [...prev, taskId]);
      setUserPoints(prev => prev + points);

      await fetchUserData();

      toast({
        title: "Task Completed!",
        description: `+${points} points earned`,
      });
    } catch (error) {
      console.error('Task completion error:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
    // }
  };

  // Helper function to get Telegram username
  // In production, this would be handled through the bot authentication flow
  const promptForTelegramUsername = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const username = prompt("Enter your Telegram user ID (obtained from the bot):");
      resolve(username);
    });
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://app.agentifyai.xyz?ref=${userData?.referralCode}`);
    toast({
      title: "Referral Link Copied!",
      description: "Share with friends to earn more points",
    });
  };

  const totalTransactionPoints = transactionLogsData.length * TRANSACTION_POINTS;
  const totalPoints = userPoints + totalTransactionPoints;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <div className="logo flex w-[1.7rem] h-[1.7rem] ">
                    <img
                      src="images/new-logo.png"
                      alt="Agentify Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                  Agentify
                </h1>
              </Link>
              {isConnected && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {isLoadingPoints ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>{userData.accumulatedPoints || transactions.length * TRANSACTION_POINTS || 0} Points</>
                  )}
                </Badge>
              )}
            </div>
            {/* {!isConnected && ( */}
            <div className="flex gap-2">
              <Button onClick={handleConnect} className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                {!isConnected ? "Connect Wallet" : "Disconnect Wallet"}
              </Button>
              {/* <Button variant="outline" onClick={handleConnect} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Sign Up with Email
                </Button> */}
            </div>
            {/* )} */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          // Pre-connection landing
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Welcome to Agentify Airdrop</h2>
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
                  {!isConnected ? "Connect Wallet" : "Disconnect Wallet"}
                </Button>
                {/* <Button onClick={handleConnect} variant="outline" size="lg" className="w-full flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Sign Up with Email
                </Button> */}
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Points</p>
                        {isLoadingPoints ? (

                          <div className="flex items-center mt-2">
                            <Skeleton className="w-20 h-6" />
                          </div>
                        ) : (
                          <p className="text-2xl font-bold">{userData?.accumulatedPoints || 0}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={refreshAllData}
                      disabled={isLoadingPoints}
                      title="Refresh points"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingPoints ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction Volume</p>
                      <p className="text-2xl font-bold">${transactionVolume.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Referrals</p>
                      <p className="text-2xl font-bold">{userData?.refferralsIds.length || 0}</p>
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
                        disabled={completedTasks.includes(task.id) || verifyingTasks[task.id]}
                      >
                        {verifyingTasks[task.id] ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Verifying...
                          </>
                        ) : completedTasks.includes(task.id) ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : task.id === 'telegram' ? (
                          <>
                            Join {/** Verify & */}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </>
                        ) : task.id === "refer" ? (
                          <>
                            Copy {/** Verify & */}
                            <CopyIcon className="h-3 w-3 ml-1" />
                          </>
                        ) : (
                          <>
                            Join
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </>
                        )}
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
                    Earn {TRANSACTION_POINTS} points per transaction
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[12rem] overflow-y-auto">
                    {transactions && transactions.length > 0 && transactions?.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.chain}</p>
                        </div>
                        <Badge variant="secondary">+{TRANSACTION_POINTS} pts</Badge>
                      </div>
                    ))}
                    
                    {/* Infinite scroll trigger */}
                    <div ref={txObserverTarget} className="h-8">
                      {isLoadingMoreTx && (
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                          <span className="text-xs text-muted-foreground">Loading more...</span>
                        </div>
                      )}
                      {!hasMoreTx && transactions.length > 0 && (
                        <div className="text-center text-xs text-muted-foreground">
                          No more transactions
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className={`flex ${transactions.length > 0 ? "justify-between" : "justify-center"} items-center`}>
                    {transactions.length > 0 && <p className="text-sm text-muted-foreground">
                      Total Transaction Points: <span className="font-bold">{userData?.transactionsPoints || transactions.length * TRANSACTION_POINTS || 0}</span>
                    </p>}
                    <Button onClick={() => window.open('https://app.agentifyai.xyz', '_blank')} size="lg" className="w-full flex items-center gap-2 md:max-w-[12rem] max-w-[11rem]">
                      <Wallet className="h-4 w-4" />
                      Make a Transaction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Volume Bonuses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Volume Bonuses</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Current Volume: <span className="font-semibold text-foreground">${transactionVolume.toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {volumeBonuses.map((bonus, index) => {
                    const progress = Math.min((transactionVolume / bonus.threshold) * 100, 100);
                    const isAchieved = transactionVolume >= bonus.threshold;

                    return (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg transition-all ${isAchieved
                          ? "bg-primary/10 border-primary shadow-md"
                          : "bg-muted/20 border-muted"
                          }`}
                      >
                        <div className="space-y-3">
                          <div className="text-center">
                            <p className="font-medium">{bonus.label}</p>
                            <p className="text-2xl font-bold text-primary">+{bonus.bonus} pts</p>
                            {isAchieved && (
                              <Badge className="mt-1" variant="default">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Achieved
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Progress value={progress} className="h-2 transition-all duration-500" />
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                ${transactionVolume.toLocaleString()} ({progress.toFixed(0)}%)
                              </span>
                              <span className={isAchieved ? "text-primary font-medium" : "text-muted-foreground"}>
                                ${bonus.threshold.toLocaleString()}
                              </span>
                            </div>
                            {!isAchieved && (
                              <p className="text-xs text-center text-muted-foreground">
                                ${(bonus.threshold - transactionVolume).toLocaleString()} more to unlock
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                  Share your referral link and earn {REFERRAL_POINT} points for each friend who joins and completes their first transaction.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-muted rounded border text-sm font-mono">
                    https://app.agentifyai.xyz?ref={userData?.referralCode || user?.id?.replace("did:privy:", "")}
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