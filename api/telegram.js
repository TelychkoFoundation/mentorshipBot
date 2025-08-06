import bot from '../bot/bot.js';

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
