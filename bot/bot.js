import { Telegraf } from 'telegraf';
import { connectToDB } from '../lib/db.js';
import User from "../models/User.js";
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {
    try {
        const res = await bot.telegram.setWebhook('https://mentorship-bot.vercel.app/api/telegram');
        console.log('✅ Webhook встановлено:', res);
    } catch (err) {
        console.error('❌ Помилка встановлення вебхука:', err);
    }
})();

bot.start(async (ctx) => {
    console.log('🚀 /start команда прийнята:', ctx.from);
    await connectToDB();

    const { id, username } = ctx.from;

    let user = await User.findOne({ id });
    if (!user) {
        // Якщо юзери створюються окремо, просто повідом про помилку
        await ctx.reply("❗️Користувача не знайдено. Звернись до адміністратора.");
    } else {
        await ctx.reply(`👋 Знову привіт, ${username}!`);
    }
});

export default bot;
