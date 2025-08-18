import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginWidgetProps {
  botUsername: string;
  privyId: string;
  onAuth: (user: TelegramUser) => void;
}

declare global {
  interface Window {
    TelegramLoginWidget?: any;
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export function TelegramLoginWidget({ botUsername, privyId, onAuth }: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create callback function
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram auth successful:', user);
      
      try {
        // Send user data to backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/telegram/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            privyId: privyId,
            telegramId: user.id.toString(),
            telegramUsername: user.username || user.first_name,
            authData: user
          }),
        });

        if (response.ok) {
          toast({
            title: "Telegram Connected!",
            description: "Now you can join the channel to earn points.",
          });
          onAuth(user);
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect Telegram. Please try again.",
          variant: "destructive",
        });
      }
    };

    // Load Telegram script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      delete window.onTelegramAuth;
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [botUsername, privyId, onAuth]);

  return <div ref={containerRef} />;
}