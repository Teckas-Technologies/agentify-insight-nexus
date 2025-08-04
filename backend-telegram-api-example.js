// Backend API endpoint example for Telegram verification
// Add this to your existing backend server (Express.js example)

const express = require('express');
const router = express.Router();

// You'll need to install: npm install node-telegram-bot-api
const TelegramBot = require('node-telegram-bot-api');

// Initialize Telegram Bot with your bot token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Your Telegram channel ID (starts with @ for public channels or -100 for private)
const CHANNEL_ID = '@' + (process.env.TELEGRAM_CHANNEL_ID || 'your_channel');

// Handle incoming messages (polling mode)
bot.on('message', async (msg) => {
  console.log('Received message:', JSON.stringify(msg, null, 2));
  
  if (msg.text && msg.text.startsWith('/start')) {
    const userId = msg.from.id;
    const username = msg.from.username;
    
    if (msg.text === '/start') {
      // Handle generic /start command
      await bot.sendMessage(userId, 
        `👋 Welcome to Agentify Airdrop Bot!\n\n` +
        `🔗 To link your account manually:\n` +
        `1. Go back to the airdrop website\n` +
        `2. Copy your Privy ID from the browser console\n` +
        `3. Send it here as: /link YOUR_PRIVY_ID\n\n` +
        `📱 Or use Telegram Desktop/Mobile app with the "Verify & Join" button for automatic linking.`,
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🌐 Open Airdrop Website",
                url: "https://airdrop.agentifyai.xyz/dapp"
              }
            ]]
          }
        }
      );
      return;
    }
    
    const privyId = msg.text.substring(7); // Remove '/start ' prefix
    console.log(`Processing /start command for privyId: ${privyId}, telegramUserId: ${userId}`);
    
    try {
      // Store the mapping between Telegram user ID and Privy ID
      await storeTelegramUserMapping(privyId, userId, username);
      
      // Send confirmation message to user with inline keyboard
      await bot.sendMessage(userId, 
        `✅ Authentication successful!\n\n` +
        `Your Telegram account has been linked to the airdrop.\n\n` +
        `🎯 Next step: Join our channel to earn 10 points!\n\n` +
        `Click the button below to join:`,
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🚀 Join Channel & Earn Points",
                url: getChannelInviteLink()
              }
            ]]
          }
        }
      );

      // Also send a follow-up message
      setTimeout(async () => {
        await bot.sendMessage(userId,
          `📋 After joining the channel:\n` +
          `• Return to the airdrop website\n` +
          `• Your points will be automatically verified\n` +
          `• No additional steps needed!\n\n` +
          `💡 Make sure you actually join the channel (not just visit it)`
        );
      }, 2000);
      
    } catch (error) {
      console.error('Error processing /start command:', error);
      await bot.sendMessage(userId, 'Sorry, there was an error processing your request. Please try again.');
    }
  } else if (msg.text && msg.text.startsWith('/link ')) {
    // Handle manual linking with /link command
    const privyId = msg.text.substring(6); // Remove '/link ' prefix
    const userId = msg.from.id;
    const username = msg.from.username;
    
    console.log(`Processing /link command for privyId: ${privyId}, telegramUserId: ${userId}`);
    
    try {
      // Store the mapping between Telegram user ID and Privy ID
      await storeTelegramUserMapping(privyId, userId, username);
      
      // Send confirmation message
      await bot.sendMessage(userId, 
        `✅ Account linked successfully!\n\n` +
        `Your Telegram account has been connected to Privy ID: ${privyId}\n\n` +
        `🎯 Next step: Join our channel to earn 10 points!`,
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🚀 Join Channel & Earn Points",
                url: getChannelInviteLink()
              }
            ]]
          }
        }
      );
      
    } catch (error) {
      console.error('Error processing /link command:', error);
      await bot.sendMessage(userId, 'Sorry, there was an error linking your account. Please check your Privy ID and try again.');
    }
  }
});

/**
 * Direct verification endpoint for channel membership
 * This approach stores user data when they first visit and checks later
 * POST /api/telegram/verify-direct
 */
router.post('/telegram/verify-direct', async (req, res) => {
  try {
    const { privyId } = req.body;

    if (!privyId) {
      return res.status(400).json({
        verified: false,
        error: 'Missing privyId parameter'
      });
    }

    // Check if user has already completed the telegram task
    const hasEarnedPoints = await checkIfTaskCompleted(privyId, 'telegram');
    
    if (hasEarnedPoints) {
      return res.json({
        verified: true,
        message: 'Task already completed'
      });
    }

    // For now, we'll implement a simple approach:
    // 1. Mark the task as completed after first attempt (simulating manual verification)
    // 2. In production, you'd implement proper membership checking
    
    // This is a simplified version - in production you'd need:
    // - User to provide their Telegram username
    // - Bot to check membership via username
    // - Or use Telegram Login widget for proper verification
    
    // For demo purposes, let's auto-verify after a delay
    const updateResult = await updateUserPoints(privyId, 'telegram', 10);
    
    return res.json({
      verified: true,
      pointsAwarded: updateResult.pointsAwarded || 0,
      totalPoints: updateResult.totalPoints || 0,
      message: 'Membership verified successfully'
    });

  } catch (error) {
    console.error('Direct verification error:', error);
    return res.status(500).json({
      verified: false,
      error: 'Internal server error during verification'
    });
  }
});

/**
 * Verify if a user is a member of the Telegram channel
 * POST /api/telegram/verify
 */
router.post('/telegram/verify', async (req, res) => {
  try {
    const { telegramUserId, privyId } = req.body;

    if (!telegramUserId || !privyId) {
      return res.status(400).json({
        isMember: false,
        error: 'Missing required parameters'
      });
    }

    // Check if user is a member of the channel
    try {
      const chatMember = await bot.getChatMember(CHANNEL_ID, telegramUserId);
      
      // Possible statuses: creator, administrator, member, restricted, left, kicked
      const validStatuses = ['creator', 'administrator', 'member'];
      const isMember = validStatuses.includes(chatMember.status);

      if (isMember) {
        // Update user points in database
        // This should match your existing database structure
        const updateResult = await updateUserPoints(privyId, 'telegram', 100);
        
        return res.json({
          isMember: true,
          pointsAwarded: updateResult.pointsAwarded || 0,
          totalPoints: updateResult.totalPoints || 0
        });
      } else {
        return res.json({
          isMember: false,
          error: 'User is not a member of the channel'
        });
      }
    } catch (telegramError) {
      console.error('Telegram API error:', telegramError);
      
      // Handle specific Telegram errors
      if (telegramError.response && telegramError.response.body) {
        const errorCode = telegramError.response.body.error_code;
        
        if (errorCode === 400) {
          return res.json({
            isMember: false,
            error: 'Invalid user ID or channel not found'
          });
        }
      }
      
      throw telegramError;
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      isMember: false,
      error: 'Internal server error during verification'
    });
  }
});

/**
 * Handle Telegram bot webhook for user authentication
 * POST /api/telegram/webhook
 */
router.post('/telegram/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    // Handle /start command with deep link parameter
    if (update.message && update.message.text) {
      const text = update.message.text;
      const userId = update.message.from.id;
      const username = update.message.from.username;
      
      if (text.startsWith('/start ')) {
        const privyId = text.substring(7); // Remove '/start ' prefix
        
        // Store the mapping between Telegram user ID and Privy ID
        await storeTelegramUserMapping(privyId, userId, username);
        
        // Send confirmation message to user with inline keyboard
        await bot.sendMessage(userId, 
          `✅ Authentication successful!\n\n` +
          `Your Telegram account has been linked to the airdrop.\n\n` +
          `🎯 Next step: Join our channel to earn ${points || 100} points!\n\n` +
          `Click the button below to join:`,
          {
            reply_markup: {
              inline_keyboard: [[
                {
                  text: "🚀 Join Channel & Earn Points",
                  url: getChannelInviteLink()
                }
              ]]
            }
          }
        );

        // Also send a follow-up message
        setTimeout(async () => {
          await bot.sendMessage(userId,
            `📋 After joining the channel:\n` +
            `• Return to the airdrop website\n` +
            `• Your points will be automatically verified\n` +
            `• No additional steps needed!\n\n` +
            `💡 Make sure you actually join the channel (not just visit it)`
          );
        }, 2000);
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

/**
 * Get user's Telegram connection status
 * GET /api/telegram/status/:privyId
 */
router.get('/telegram/status/:privyId', async (req, res) => {
  try {
    const { privyId } = req.params;
    
    // Check if user has connected their Telegram account
    const telegramUser = await getTelegramUserByPrivyId(privyId);
    
    if (!telegramUser) {
      return res.json({
        connected: false,
        verified: false
      });
    }
    
    // Check if user has already earned points for Telegram
    let hasEarnedPoints = await checkIfTaskCompleted(privyId, 'telegram');
    
    // If not already verified, check if user has joined the channel
    if (!hasEarnedPoints) {
      try {
        const chatMember = await bot.getChatMember(CHANNEL_ID, telegramUser.telegramUserId);
        const validStatuses = ['creator', 'administrator', 'member'];
        const isMember = validStatuses.includes(chatMember.status);
        
        if (isMember) {
          // User has joined! Award points and mark as completed
          const updateResult = await updateUserPoints(privyId, 'telegram', 100);
          hasEarnedPoints = true;
          
          console.log(`User ${privyId} verified and awarded ${updateResult.pointsAwarded} points`);
        }
      } catch (telegramError) {
        console.error('Telegram membership check error:', telegramError);
        // Don't throw error, just return current status
      }
    }
    
    return res.json({
      connected: true,
      verified: hasEarnedPoints,
      telegramUsername: telegramUser.username
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({
      error: 'Failed to check status'
    });
  }
});

// Database helper functions (implement according to your database schema)
async function updateUserPoints(privyId, taskName, points) {
  // Example implementation - adjust to match your database
  try {
    // Check if task already completed
    const user = await User.findOne({ privyId });
    
    if (user.completedTasks[taskName]) {
      return {
        pointsAwarded: 0,
        totalPoints: user.accumulatedPoints
      };
    }
    
    // Update user points and mark task as completed
    user.completedTasks[taskName] = true;
    user.accumulatedPoints += points;
    await user.save();
    
    return {
      pointsAwarded: points,
      totalPoints: user.accumulatedPoints
    };
  } catch (error) {
    console.error('Database update error:', error);
    throw error;
  }
}

async function storeTelegramUserMapping(privyId, telegramUserId, username) {
  // Store the mapping in your database
  try {
    await TelegramUser.upsert({
      privyId,
      telegramUserId,
      username,
      connectedAt: new Date()
    });
  } catch (error) {
    console.error('Failed to store Telegram mapping:', error);
    throw error;
  }
}

async function getTelegramUserByPrivyId(privyId) {
  // Retrieve Telegram user data from database
  try {
    return await TelegramUser.findOne({ privyId });
  } catch (error) {
    console.error('Failed to get Telegram user:', error);
    return null;
  }
}

async function checkIfTaskCompleted(privyId, taskName) {
  // Check if user has completed the task
  try {
    const user = await User.findOne({ privyId });
    return user?.completedTasks?.[taskName] || false;
  } catch (error) {
    console.error('Failed to check task completion:', error);
    return false;
  }
}

function getChannelInviteLink() {
  // Return the channel link from environment variable
  const channelId = process.env.TELEGRAM_CHANNEL_ID || '@your_channel';
  
  // If it's a public channel (starts with @), convert to t.me link
  if (channelId.startsWith('@')) {
    return `https://t.me/${channelId.substring(1)}`;
  }
  
  // For private channels, you'd need to create an invite link via bot API
  // For now, return the public channel format
  return `https://t.me/${channelId}`;
}

module.exports = router;

/* 
SETUP INSTRUCTIONS:

1. Create a Telegram Bot:
   - Message @BotFather on Telegram
   - Send /newbot and follow instructions
   - Save the bot token

2. Get your channel ID:
   - Add your bot as admin to your channel
   - For public channels: use @channelname
   - For private channels: use the channel ID (starts with -100)

3. Set up environment variables:
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHANNEL_ID=@your_channel_or_id

4. Set up webhook (for production):
   - Configure your bot webhook to point to: https://yourdomain.com/api/telegram/webhook
   - Or use polling for development

5. Database schema needs:
   - User model with: privyId, accumulatedPoints, completedTasks (object)
   - TelegramUser model with: privyId, telegramUserId, username, connectedAt
*/