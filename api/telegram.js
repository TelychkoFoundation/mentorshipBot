import { Telegraf } from 'telegraf';
import { connectToDB } from '../lib/db.js';
import User from "../models/User.js";
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.launch({
    webhook: {
        domain: "https://mentorship-bot.vercel.app/api/telegram", // Replace with your domain
    },
});

// реєструємо хендлери тут, бо Vercel кожен раз викликає цю функцію окремо
bot.start(async (ctx) => {
    console.log('🚀 /start команда прийнята:', ctx.from);
    await connectToDB();

    const { id, username } = ctx.from;

    const user = await User.findOne({ id });
    if (!user) {
        await ctx.reply("❗️Користувача не знайдено. Звернись до адміністратора.");
    } else {
        await ctx.reply(`👋 Знову привіт, ${username}!`);
    }
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await bot.handleUpdate(req.body);
        } catch (err) {
            console.error('Telegram bot error:', err);
        }
        res.status(200).send('OK');
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
