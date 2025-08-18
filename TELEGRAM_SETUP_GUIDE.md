# Telegram Validation Setup Guide

## Overview
This guide explains how to set up proper Telegram validation with user authentication and channel membership verification for the Agentify Airdrop platform.

## Architecture

### Flow Diagram
```
1. User clicks "Connect" button on website
2. User is redirected to Telegram bot with Privy ID
3. Bot authenticates user and stores Telegram ID
4. User returns to website and sees "Join Channel" button
5. User clicks "Join Channel" and joins the Telegram channel
6. Website verifies membership through bot API
7. Points are awarded after successful verification
```

## Implementation Components

### 1. Frontend Components

#### TelegramAuth Component (`src/components/TelegramAuth.tsx`)
- Handles the Connect → Join flow
- Manages authentication state
- Polls for verification status
- Awards points after successful verification

#### DApp Integration (`src/pages/DApp.tsx`)
- Uses TelegramAuth component for Telegram task
- Tracks Telegram connection status
- Updates user points after verification

### 2. Backend Requirements

#### API Endpoints Required

1. **GET /api/telegram/status/:privyId**
   - Check if user has connected Telegram
   - Returns: `{ connected: boolean, verified: boolean, telegramId?: string }`

2. **POST /api/telegram/verify**
   - Verify channel membership
   - Body: `{ privyId: string, telegramId: string }`
   - Returns: `{ isMember: boolean, pointsAwarded?: number }`

3. **POST /api/telegram/connect** (optional)
   - Manually connect Telegram account
   - Body: `{ privyId: string, telegramId: string, telegramUsername?: string }`

#### Database Schema

**TelegramUser Collection/Table:**
```javascript
{
  privyId: String (unique, indexed),
  telegramId: String (unique),
  telegramUsername: String (optional),
  connectedAt: Date,
  updatedAt: Date
}
```

**User Collection Update:**
```javascript
{
  // Existing fields...
  completedTasks: {
    telegram: Boolean,
    twitter: Boolean,
    // other tasks...
  },
  tasks: {
    telegram: {
      completed: Boolean,
      completedAt: Date,
      pointsAwarded: Number
    }
  }
}
```

## Setup Instructions

### Step 1: Create Telegram Bot

1. Open Telegram and search for @BotFather
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "Agentify Airdrop Bot")
4. Choose a username (must end in 'bot', e.g., "agentify_airdrop_bot")
5. Save the bot token provided by BotFather
6. Set bot description: `/setdescription`
7. Set about text: `/setabouttext`

### Step 2: Setup Telegram Channel

1. Create a public channel on Telegram
2. Note the channel username (e.g., @agentifyportal)
3. Add your bot as an administrator to the channel
4. Grant the bot permission to view members

### Step 3: Configure Environment Variables

Update your `.env` file:
```env
# Frontend (.env)
VITE_TELEGRAM_BOT_USERNAME=agentify_airdrop_bot
VITE_TELEGRAM_CHANNEL_LINK=https://t.me/agentifyportal
VITE_API_URL=https://your-backend-url.com

# Backend (.env)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=@agentifyportal
```

### Step 4: Deploy Backend Bot

1. Install dependencies:
```bash
npm install node-telegram-bot-api express
```

2. Integrate the bot router (`telegram-bot-backend.js`) into your Express server:
```javascript
const telegramRouter = require('./telegram-bot-backend');
app.use('/api', telegramRouter);
```

3. Ensure your database models are properly set up

### Step 5: Test the Integration

1. **Test Bot Connection:**
   - Open your bot in Telegram
   - Send `/start` - should receive welcome message
   - Send `/start test_privy_id` - should authenticate

2. **Test Frontend Flow:**
   - Connect wallet on website
   - Click "Connect" button in Telegram task
   - Authenticate with bot
   - Click "Join Channel" button
   - Join the channel
   - Verify points are awarded

## Security Considerations

1. **Validate Privy IDs:** Always validate that Privy IDs are legitimate
2. **Rate Limiting:** Implement rate limiting on verification endpoints
3. **Bot Token Security:** Never expose bot token in frontend code
4. **Channel Privacy:** Consider using private channels with invite links
5. **Duplicate Prevention:** Ensure users can't claim points multiple times

## Troubleshooting

### Common Issues

1. **Bot not responding:**
   - Check bot token is correct
   - Ensure bot is running and polling enabled
   - Check network connectivity

2. **Channel membership not detected:**
   - Verify bot is admin in channel
   - Check channel ID format (@username for public)
   - Ensure user actually joined (not just visited)

3. **Points not awarded:**
   - Check database connection
   - Verify task completion logic
   - Check for duplicate task completion

### Debug Mode

Enable debug logging in bot:
```javascript
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

bot.on('webhook_error', (error) => {
  console.log('Webhook error:', error);
});
```

## Production Deployment

### Using Webhooks (Recommended for Production)

Instead of polling, use webhooks for better performance:

1. Set webhook URL:
```javascript
bot.setWebHook('https://yourdomain.com/telegram-webhook');
```

2. Disable polling:
```javascript
const bot = new TelegramBot(token, { polling: false });
```

3. Handle webhook in Express:
```javascript
app.post('/telegram-webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
```

### Scaling Considerations

1. **Database Indexing:** Index privyId and telegramId fields
2. **Caching:** Cache user verification status
3. **Queue System:** Use message queue for bot commands
4. **Load Balancing:** Distribute bot instances if needed

## Monitoring

### Key Metrics to Track

1. Bot connection success rate
2. Channel join verification rate
3. Points awarded per day
4. Failed verification attempts
5. Average verification time

### Logging

Implement comprehensive logging:
```javascript
console.log(`[${new Date().toISOString()}] User ${privyId} connected Telegram ID ${telegramId}`);
console.log(`[${new Date().toISOString()}] Verification: ${privyId} - Member: ${isMember}`);
```

## Support

For issues or questions:
1. Check bot logs for errors
2. Verify all environment variables are set
3. Test with Telegram test accounts
4. Review database records for inconsistencies

## Updates and Maintenance

1. Regularly update bot dependencies
2. Monitor Telegram API changes
3. Review and update verification logic
4. Keep bot token secure and rotate if compromised