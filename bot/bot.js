import { Telegraf } from 'telegraf';
import { connectToDB } from '../lib/db.js';
import User from "../models/User.js";

const bot = new Telegraf(process.env.BOT_TOKEN);

await bot.telegram.setWebhook('https://mentorship-bot.vercel.app/api/telegram');

bot.start(async (ctx) => {
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
