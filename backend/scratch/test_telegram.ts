import dotenv from 'dotenv';
import path from 'path';
// Load .env from the root of backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { sendTelegramAlert } from '../src/services/telegram.service';

async function testTelegram() {
  console.log('Testing Telegram Alert with credentials from .env...');
  console.log('Token:', process.env.TELEGRAM_BOT_TOKEN ? 'Present' : 'Missing');
  console.log('Chat ID:', process.env.TELEGRAM_CHAT_ID ? 'Present' : 'Missing');
  
  await sendTelegramAlert('This is a test alert from the Major project system! 🧪');
}

testTelegram();
