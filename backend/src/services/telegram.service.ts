import axios from 'axios';
import logger from '../utils/logger';
import prisma from '../prisma';

export const sendTelegramAlert = async (message: string) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      logger.warn('Telegram token not configured');
      return;
    }

    const formattedMessage = `
🚨 *INDUSTRIAL MONITORING ALERT* 🚨

${message}

*Time:* ${new Date().toLocaleString()}
    `;

    // Get ALL subscribers from database
    const subscribers = await prisma.subscriber.findMany();

    // Also include owner's chat ID from .env
    const ownerChatId = process.env.TELEGRAM_CHAT_ID;
    if (ownerChatId) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: ownerChatId,
        text: formattedMessage,
        parse_mode: 'Markdown'
      });
    }

    // Send to ALL subscribers
    for (const subscriber of subscribers) {
      try {
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

    logger.info(`Telegram alerts sent to ${subscribers.length + 1} recipients`);
  } catch (error: any) {
    logger.error(`Failed to send Telegram alert: ${error.message}`);
  }
};