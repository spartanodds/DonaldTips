require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getTodayMatchesByLeague, getTodayLeagues } = require('./sheets');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/quais apostas para hoje/i, async (msg) => {
  const chatId = msg.chat.id;
  const leagues = await getTodayLeagues();
  const buttons = leagues.map(league => [{ text: league }]);
  bot.sendMessage(chatId, '🏆 Escolha um campeonato:', {
    reply_markup: { keyboard: buttons, one_time_keyboard: true, resize_keyboard: true }
  });
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const leagues = await getTodayLeagues();
  if (leagues.includes(text)) {
    const matches = await getTodayMatchesByLeague(text);
    if (matches.length === 0) return bot.sendMessage(chatId, 'Nenhum jogo encontrado.');

    let response = `⚽ ${text} – ${new Date().toLocaleDateString('pt-BR')}

`;
    matches.forEach(match => {
      response += `🔥 ${match.timeA} x ${match.timeB}
` +
                  `📊 Probabilidades:
` +
                  `• ${match.timeA}: ${match.probA}%
` +
                  `• Empate: ${match.probX}%
` +
                  `• ${match.timeB}: ${match.probB}%
` +
                  `💰 Odds: ${match.oddsA} / ${match.oddsX} / ${match.oddsB}

`;
    });
    response += '🤖 Powered by Lucas Barbosa | Donaldbet Tips IA';
    bot.sendMessage(chatId, response);
  }
});

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("DonaldTips Bot ativo.");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
