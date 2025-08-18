interface TelegramVerificationResponse {
  isMember: boolean;
  error?: string;
}

interface TelegramStatusResponse {
  connected: boolean;
  verified: boolean;
  telegramId?: string;
  telegramUsername?: string;
}

export class TelegramVerificationService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL;
  }

  /**
   * Verify if a user has joined the Telegram channel
   * @param telegramId - The user's Telegram ID
   * @param privyId - The user's Privy ID for backend association
   * @returns Promise with verification result
   */
  async verifyChannelMembership(
    telegramId: string,
    privyId: string
  ): Promise<TelegramVerificationResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/telegram/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramUserId: telegramId,
          privyId: privyId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Telegram verification error:', error);
      return {
        isMember: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  /**
   * Generate Telegram deep link for authentication
   * @param privyId - The user's Privy ID
   * @returns Telegram bot deep link URL
   */
  generateTelegramAuthLink(privyId: string): string {
    // Replace 'your_bot_name' with your actual bot username
    const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'your_bot_name';
    const encodedPrivyId = encodeURIComponent(privyId);
    return `https://t.me/${botUsername}?start=${encodedPrivyId}`;
  }

  /**
   * Get Telegram channel link
   * @returns Telegram channel URL
   */
  getChannelLink(): string {
    return import.meta.env.VITE_TELEGRAM_CHANNEL_LINK || 'https://t.me/example';
  }

  /**
   * Check user's Telegram connection and verification status
   * @param privyId - The user's Privy ID
   * @returns Promise with status result
   */
  async checkUserStatus(privyId: string): Promise<TelegramStatusResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/telegram/status/${privyId}`);
      
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Status check error:', error);
      return {
        connected: false,
        verified: false
      };
    }
  }

  /**
   * Verify channel membership directly without bot authentication
   * @param privyId - The user's Privy ID
   * @returns Promise with verification result
   */
  async verifyDirectChannelMembership(privyId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/telegram/verify-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privyId: privyId,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.verified || false;
    } catch (error) {
      console.error('Direct verification error:', error);
      return false;
    }
  }
}

export const telegramVerificationService = new TelegramVerificationService();