// Enhanced Telegram Bot Backend with User ID Authentication
// This file should be integrated into your backend server

const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Your Telegram channel
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@agentifyportal';
const POINTS_REWARD = 50; // Points for joining Telegram

// Database models (adjust to your schema)
// You'll need to create a TelegramUser collection/table
const { User, TelegramUser } = require('./models'); // Adjust path

/**
 * Handle /start command from Telegram bot
 * This connects the Telegram user ID with the Privy ID
 */
bot.on('message', async (msg) => {
  console.log('Received message:', JSON.stringify(msg, null, 2));
  
  if (msg.text && msg.text.startsWith('/start')) {
    const telegramUserId = msg.from.id;
    const telegramUsername = msg.from.username || msg.from.first_name;
    
    // Send welcome message with Telegram ID for user to copy
    await bot.sendMessage(telegramUserId, 
      `👋 *Welcome to Agentify Airdrop Bot!*\n\n` +
      `🆔 *Your Telegram ID:* \`${telegramUserId}\`\n\n` +
      `📋 *To connect your account:*\n` +
      `1. Copy your Telegram ID above\n` +
      `2. Go to the airdrop website\n` +
      `3. Click "Connect Telegram" and paste your ID\n` +
      `4. Join our channel to earn ${POINTS_REWARD} points!\n\n` +
      `🔗 *Airdrop Website:* https://airdrop.agentifyai.xyz`,
      { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Join Channel",
                url: getChannelLink()
              }
            ],
            [
              {
                text: "🌐 Open Airdrop Website",
                url: "https://airdrop.agentifyai.xyz"
              }
            ]
          ]
        }
      }
    );
    
    // Also send ID as a separate copyable message
    await bot.sendMessage(telegramUserId, telegramUserId.toString());
  }
});

/**
 * API endpoint to check Telegram connection status
 * GET /api/telegram/status/:privyId
 */
router.get('/telegram/status/:privyId', async (req, res) => {
  try {
    const { privyId } = req.params;
    
    // Check if user has connected Telegram
    const telegramUser = await TelegramUser.findOne({ privyId });
    
    if (!telegramUser) {
      return res.json({
        connected: false,
        verified: false
      });
    }
    
    // Check if user has already earned points
    const user = await User.findOne({ privyId });
    const hasEarnedPoints = user?.completedTasks?.telegram || false;
    
    // If not verified yet, check channel membership
    if (!hasEarnedPoints && telegramUser.telegramId) {
      try {
        const chatMember = await bot.getChatMember(CHANNEL_ID, telegramUser.telegramId);
        const isMember = ['creator', 'administrator', 'member'].includes(chatMember.status);
        
        if (isMember) {
          // Auto-complete the task if member
          await completeTask(privyId, 'telegram', POINTS_REWARD);
        }
      } catch (error) {
        console.error('Channel membership check error:', error);
      }
    }
    
    return res.json({
      connected: true,
      verified: hasEarnedPoints,
      telegramId: telegramUser.telegramId,
      telegramUsername: telegramUser.telegramUsername
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({
      error: 'Failed to check status'
    });
  }
});

/**
 * API endpoint to verify channel membership
 * POST /api/telegram/verify
 */
router.post('/telegram/verify', async (req, res) => {
  try {
    const { privyId, telegramUserId, telegramId } = req.body;
    const userId = telegramUserId || telegramId; // Support both parameter names
    
    if (!privyId || !userId) {
      return res.status(400).json({
        isMember: false,
        error: 'Missing required parameters'
      });
    }
    
    // Check if already completed
    const user = await User.findOne({ privyId });
    if (user?.completedTasks?.telegram) {
      return res.json({
        isMember: true,
        alreadyCompleted: true,
        pointsAwarded: 0
      });
    }
    
    // Verify channel membership
    try {
      const chatMember = await bot.getChatMember(CHANNEL_ID, userId);
      const validStatuses = ['creator', 'administrator', 'member'];
      const isMember = validStatuses.includes(chatMember.status);
      
      if (isMember) {
        // Award points
        const result = await completeTask(privyId, 'telegram', POINTS_REWARD);
        
        return res.json({
          isMember: true,
          pointsAwarded: POINTS_REWARD,
          totalPoints: result.totalPoints
        });
      } else {
        return res.json({
          isMember: false,
          error: 'Not a member of the channel'
        });
      }
    } catch (telegramError) {
      console.error('Telegram API error:', telegramError);
      
      if (telegramError.response?.statusCode === 400) {
        return res.json({
          isMember: false,
          error: 'Invalid Telegram ID or channel not found'
        });
      }
      
      throw telegramError;
    }
    
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      isMember: false,
      error: 'Verification failed'
    });
  }
});

/**
 * API endpoint to connect Telegram account manually
 * POST /api/telegram/connect
 */
router.post('/telegram/connect', async (req, res) => {
  try {
    const { privyId, telegramId, telegramUserId, telegramUsername } = req.body;
    const userId = telegramId || telegramUserId; // Support both parameter names
    
    if (!privyId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // Validate Telegram ID format (should be numeric)
    if (!/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Telegram ID format'
      });
    }
    
    // Store or update Telegram user
    await storeTelegramUser({
      privyId,
      telegramId: userId,
      telegramUsername,
      connectedAt: new Date()
    });
    
    return res.json({
      success: true,
      message: 'Telegram account connected successfully'
    });
    
  } catch (error) {
    console.error('Connection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to connect Telegram account'
    });
  }
});

/**
 * API endpoint for Telegram widget authentication
 * POST /api/telegram/auth
 */
router.post('/telegram/auth', async (req, res) => {
  try {
    const { privyId, telegramId, telegramUsername, authData } = req.body;
    
    if (!privyId || !telegramId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // Here you could verify the Telegram auth hash for security
    // See: https://core.telegram.org/widgets/login#checking-authorization
    
    // Store Telegram user
    await storeTelegramUser({
      privyId,
      telegramId: telegramId.toString(),
      telegramUsername,
      connectedAt: new Date(),
      authData: authData
    });
    
    return res.json({
      success: true,
      message: 'Telegram authentication successful'
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
});

// Helper Functions

/**
 * Store or update Telegram user in database
 */
async function storeTelegramUser(data) {
  try {
    // Using upsert to create or update
    const existingUser = await TelegramUser.findOne({ privyId: data.privyId });
    
    if (existingUser) {
      // Update existing record
      existingUser.telegramId = data.telegramId;
      existingUser.telegramUsername = data.telegramUsername;
      existingUser.updatedAt = new Date();
      await existingUser.save();
    } else {
      // Create new record
      await TelegramUser.create(data);
    }
    
    console.log(`Stored Telegram user: ${data.privyId} -> ${data.telegramId}`);
  } catch (error) {
    console.error('Failed to store Telegram user:', error);
    throw error;
  }
}

/**
 * Complete task and award points
 */
async function completeTask(privyId, taskName, points) {
  try {
    const user = await User.findOne({ privyId });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if already completed
    if (user.completedTasks?.[taskName]) {
      return {
        pointsAwarded: 0,
        totalPoints: user.accumulatedPoints || 0
      };
    }
    
    // Update user
    if (!user.completedTasks) {
      user.completedTasks = {};
    }
    user.completedTasks[taskName] = true;
    user.accumulatedPoints = (user.accumulatedPoints || 0) + points;
    
    // Track task completion
    if (!user.tasks) {
      user.tasks = {};
    }
    user.tasks[taskName] = {
      completed: true,
      completedAt: new Date(),
      pointsAwarded: points
    };
    
    await user.save();
    
    console.log(`Task completed: ${privyId} - ${taskName} (+${points} points)`);
    
    return {
      pointsAwarded: points,
      totalPoints: user.accumulatedPoints
    };
  } catch (error) {
    console.error('Failed to complete task:', error);
    throw error;
  }
}

/**
 * Get channel link
 */
function getChannelLink() {
  const channelId = CHANNEL_ID;
  
  // Convert @username to t.me link
  if (channelId.startsWith('@')) {
    return `https://t.me/${channelId.substring(1)}`;
  }
  
  // For private channels, you'd need to generate invite link
  return `https://t.me/${channelId}`;
}

module.exports = router;

/* 
=====================================================
SETUP INSTRUCTIONS
=====================================================

1. CREATE TELEGRAM BOT:
   - Message @BotFather on Telegram
   - Send /newbot and follow instructions
   - Save the bot token
   - Send /setdescription to set bot description
   - Send /setabouttext to set about text

2. GET CHANNEL ID:
   - For public channels: use @channelname
   - For private channels: 
     a. Add bot as admin to channel
     b. Use bot.getChat('@channelname') to get ID

3. ENVIRONMENT VARIABLES:
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHANNEL_ID=@your_channel_name

4. DATABASE SCHEMA:
   
   TelegramUser Collection/Table:
   {
     privyId: String (unique, indexed),
     telegramId: String (unique),
     telegramUsername: String,
     connectedAt: Date,
     updatedAt: Date
   }
   
   User Collection/Table (update existing):
   {
     privyId: String,
     accumulatedPoints: Number,
     completedTasks: {
       telegram: Boolean,
       twitter: Boolean,
       discord: Boolean,
       github: Boolean
     },
     tasks: {
       telegram: {
         completed: Boolean,
         completedAt: Date,
         pointsAwarded: Number
       }
     }
   }

5. INSTALL DEPENDENCIES:
   npm install node-telegram-bot-api express

6. INTEGRATE WITH YOUR BACKEND:
   - Import this router in your main server file
   - app.use('/api', telegramRouter);

7. WEBHOOK (OPTIONAL - for production):
   - Set webhook: bot.setWebHook('https://yourdomain.com/telegram-webhook')
   - Disable polling: { polling: false }

8. TEST THE FLOW:
   - User clicks "Connect" on website
   - Opens bot with deep link
   - Bot authenticates and stores Telegram ID
   - User joins channel
   - Website verifies membership
   - Points are awarded

=====================================================
*/