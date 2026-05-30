import axios from 'axios';
import logger from '../utils/logger';
import prisma from '../prisma';

// Rate limit: track last send time
let lastSentAt = 0;
const MIN_INTERVAL_MS = 3000; // min 3 seconds between any Telegram message

export const sendTelegramAlert = async (message: string) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      logger.warn('Telegram token not configured');
      return;
    }

    // Enforce minimum interval between messages
    const now = Date.now();
    const gap = now - lastSentAt;
    if (gap < MIN_INTERVAL_MS) {
      await new Promise(res => setTimeout(res, MIN_INTERVAL_MS - gap));
    }
    lastSentAt = Date.now();

    const formattedMessage = `🚨 *INDUSTRIAL MONITORING ALERT* 🚨\n\n${message}\n\n*Time:* ${new Date().toLocaleString()}`;

    const ownerChatId = process.env.TELEGRAM_CHAT_ID;
    if (ownerChatId) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: ownerChatId,
        text: formattedMessage,
        parse_mode: 'Markdown'
      });
      logger.info(`Telegram alert sent to owner`);
    }

    const subscribers = await prisma.subscriber.findMany();
    for (const subscriber of subscribers) {
      try {
        await new Promise(res => setTimeout(res, 500)); // 500ms between each subscriber
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: subscriber.chatId,
          text: formattedMessage,
          parse_mode: 'Markdown'
        });
        logger.info(`Alert sent to subscriber: ${subscriber.name || subscriber.chatId}`);
      } catch (err: any) {
        logger.error(`Failed to send to ${subscriber.chatId}: ${err.message}`);
      }
    }
  } catch (error: any) {
    logger.error(`Failed to send Telegram alert: ${error.message}`);
  }
};
