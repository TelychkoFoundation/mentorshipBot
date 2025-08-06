// setWebhook.js
import bot from './bot/bot.js';

await bot.telegram.setWebhook('https://mentorship-bot.vercel.app/api/telegram');
console.log("✅ Вебхук встановлено");
