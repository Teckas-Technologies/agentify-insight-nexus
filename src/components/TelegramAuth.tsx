import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, ExternalLink, MessageCircle, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TelegramAuthProps {
  privyId: string;
  onSuccess: (telegramId: string) => void;
  points: number;
  isCompleted: boolean;
  onLayoutChange?: (showInput: boolean) => void;
}

declare global {
  interface Window {
    Telegram?: {
      Login: {
        auth: (options: any, callback: (user: any) => void) => void;
      };
    };
  }
}

export function TelegramAuth({ privyId, onSuccess, points, isCompleted, onLayoutChange }: TelegramAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [inputTelegramId, setInputTelegramId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showIdInput, setShowIdInput] = useState(false);
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL;
  const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'agentify_airdrop_test_bot';
  const CHANNEL_LINK = import.meta.env.VITE_TELEGRAM_CHANNEL_LINK || 'https://t.me/agentifyportal';

  useEffect(() => {
    checkTelegramStatus();
  }, [privyId]);

  const checkTelegramStatus = async () => {
    try {
      console.log('Checking Telegram status for:', privyId);
      const response = await fetch(`${API_BASE}/api/telegram/status/${privyId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Telegram status response:', data);
        if (data.connected) {
          setIsConnected(true);
          setTelegramId(data.telegramId);
          console.log('Telegram connected:', data.telegramId);
        } else {
          setIsConnected(false);
          setTelegramId(null);
          console.log('Telegram not connected');
        }
      }
    } catch (error) {
      console.error('Failed to check Telegram status:', error);
    }
  };

  const handleOpenBot = () => {
    // Open bot without parameters
    const botLink = `https://t.me/${BOT_USERNAME}`;
    window.open(botLink, '_blank');

    toast({
      title: "Get Your Telegram ID",
      description: "1. Click 'START' in the bot\n2. Copy your Telegram ID\n3. Come back and paste it here",
    });

    setShowIdInput(true);
    onLayoutChange?.(true);
  };

  const handleConnectWithId = async () => {
    if (!inputTelegramId.trim()) {
      toast({
        title: "Enter Telegram ID",
        description: "Please enter your Telegram ID from the bot",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Connect Telegram ID with Privy ID
      const response = await fetch(`${API_BASE}/api/telegram/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privyId: privyId,
          telegramUserId: inputTelegramId.trim(),
        }),
      });

      if (response.ok) {
        setIsConnected(true);
        setTelegramId(inputTelegramId.trim());
        setShowIdInput(false);
        onLayoutChange?.(false);

        toast({
          title: "Telegram Connected!",
          description: "Now you can join the channel to earn points.",
        });

        onSuccess(inputTelegramId.trim());
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect Telegram ID. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect Telegram. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleJoinChannel = async () => {
    // Check current status directly from API
    try {
      const response = await fetch(`${API_BASE}/api/telegram/status/${privyId}`);
      const data = await response.json();
      console.log("Data:>>>>", data)

      if (!data.connected || !data.telegramUserId) {
        toast({
          title: "Connect Telegram First",
          description: "Please connect your Telegram account before joining the channel.",
          variant: "destructive",
        });
        return;
      }

      // Update local state and proceed
      setIsConnected(true);
      setTelegramId(data.telegramUserId);
      performChannelVerification(data.telegramUserId);

    } catch (error) {
      console.error('Status check error:', error);
      toast({
        title: "Connection Check Failed",
        description: "Unable to verify Telegram connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const performChannelVerification = async (currentTelegramId?: string) => {
    const telegramIdToUse = currentTelegramId || telegramId;

    if (!telegramIdToUse) {
      toast({
        title: "Telegram ID Missing",
        description: "Unable to find Telegram ID. Please reconnect.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    // Open the channel
    window.open(CHANNEL_LINK, '_blank');

    toast({
      title: "Join the Channel",
      description: "Please join the channel. We'll verify your membership automatically.",
    });

    // Start verification polling
    let attempts = 0;
    const maxAttempts = 30; // Check for 2 minutes

    const pollMembership = setInterval(async () => {
      attempts++;

      try {
        console.log('Verifying membership for Telegram ID:', telegramIdToUse);
        const response = await fetch(`${API_BASE}/api/telegram/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            privyId: privyId,
            telegramUserId: telegramIdToUse,
          }),
        });

        const data = await response.json();
        console.log('Verification response:', data);

        if (data.isMember) {
          clearInterval(pollMembership);
          setIsVerifying(false);

          // Complete the task
          await fetch(`${API_BASE}/api/onboarding/task/telegram/${privyId}`, {
            method: 'PATCH',
          });

          toast({
            title: "Verification Successful!",
            description: `+${points} points for joining Telegram channel`,
          });

          // Refresh parent component
          window.location.reload();
        }
      } catch (error) {
        console.error('Verification error:', error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollMembership);
        setIsVerifying(false);
        toast({
          title: "Verification Timeout",
          description: "Please make sure you've joined the channel and try again.",
          variant: "destructive",
        });
      }
    }, 4000); // Check every 4 seconds
  };

  if (isCompleted) {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled
        className="min-w-[130px]"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <div className="space-y-2">
        {!showIdInput ? (
          <Button
            size="sm"
            onClick={handleOpenBot}
            className="min-w-[130px]"
          >
            Connect
            <Rocket className="h-3 w-3 mr-1" />
          </Button>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="telegram-id" className="text-xs">
              Enter your Telegram ID from the bot:
            </Label>
            <div className="flex gap-2">
              <Input
                id="telegram-id"
                type="text"
                placeholder="Telegram ID"
                value={inputTelegramId}
                onChange={(e) => setInputTelegramId(e.target.value)}
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                onClick={handleConnectWithId}
                disabled={isConnecting}
                className="min-w-[130px]"
              >
                {isConnecting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleJoinChannel}
      disabled={isVerifying}
      className="min-w-[130px]"
    >
      {isVerifying ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Verifying...
        </>
      ) : (
        <>
          Join Channel
          <ExternalLink className="h-3 w-3 ml-1" />
        </>
      )}
    </Button>
  );
}