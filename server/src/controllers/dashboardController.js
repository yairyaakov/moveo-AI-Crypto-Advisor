const prisma = require('../config/prisma');
const { fetchPrices } = require('../services/cryptoPrices');
const { getRandomMeme } = require('../services/meme');

function getMockNews(assets) {
  return assets.flatMap(coin => [
    { id: `news-${coin}-1`, title: `${coin} shows strong momentum as institutional interest grows`, source: 'CryptoNews' },
    { id: `news-${coin}-2`, title: `Analysts weigh in on ${coin}'s next price target`, source: 'CoinDesk' },
  ]).slice(0, 6);
}

function getMockInsight(assets, investorType) {
  const coinList = assets.join(', ');
  const strategy = investorType === 'long-term'
    ? 'focus on accumulation during dips and avoid reacting to short-term volatility'
    : investorType === 'short-term'
    ? 'watch for breakout patterns and set tight stop-losses'
    : 'diversify across your selected assets and rebalance regularly';

  return {
    id: 'insight-today',
    text: `As a ${investorType} investor holding ${coinList}, today's key insight is to ${strategy}. Market sentiment remains mixed — stay disciplined.`,
  };
}


async function getDashboard(req, res) {
  const userId = req.user.id;

  const preference = await prisma.preference.findUnique({ where: { userId } });

  if (!preference) {
    return res.status(400).json({ error: 'Onboarding not completed. Please complete the onboarding quiz first.' });
  }

  const assets = JSON.parse(preference.assets);
  const { investorType } = preference;

  const prices = await fetchPrices(assets);

  res.json({
    news:      getMockNews(assets),
    prices,
    aiInsight: getMockInsight(assets, investorType),
    meme:      getRandomMeme(assets),
  });
}

module.exports = { getDashboard };
