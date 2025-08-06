import { Telegraf } from 'telegraf';
import { connectToDB } from '../lib/db.js';
import { User } from "../models/User";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    await connectToDB();

    const { id, username } = ctx.from;

    let user = await User.findOne({ telegramId: id });
    if (!user) {
        user = await User.create({
            telegramId: id,
            username,
            mentorship: {
                expiresAt: null,
                questionsLeft: 0
            }
        });
        await ctx.reply(`👋 Привіт, ${username}! Тебе додано.`);
    } else {
        await ctx.reply(`👋 Знову привіт, ${username}!`);
    }
});

export default bot;
