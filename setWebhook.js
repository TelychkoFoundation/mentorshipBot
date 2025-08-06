// setWebhook.js
import bot from './bot.js';

await bot.telegram.setWebhook('https://mentorship-bot.vercel.app/api/telegram');
console.log("✅ Вебхук встановлено");
