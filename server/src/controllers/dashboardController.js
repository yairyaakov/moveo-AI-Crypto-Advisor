const prisma = require('../config/prisma');
const { fetchPrices } = require('../services/cryptoPrices');
const { getRandomMeme } = require('../services/meme');
const { generateAIInsight } = require('../services/aiInsight');

function getMockNews(assets) {
  return assets.flatMap(coin => [
    { id: `news-${coin}-1`, title: `${coin} shows strong momentum as institutional interest grows`, source: 'CryptoNews' },
    { id: `news-${coin}-2`, title: `Analysts weigh in on ${coin}'s next price target`, source: 'CoinDesk' },
  ]).slice(0, 6);
}



async function getDashboard(req, res) {
  const userId = req.user.id;

  const preference = await prisma.preference.findUnique({ where: { userId } });

  if (!preference) {
    return res.status(400).json({ error: 'Onboarding not completed. Please complete the onboarding quiz first.' });
  }

  const assets = JSON.parse(preference.assets);
  const contentTypes = JSON.parse(preference.contentTypes);
  const { investorType } = preference;

  const [prices, aiInsight] = await Promise.all([
    fetchPrices(assets),
    generateAIInsight({ assets, investorType, contentTypes }),
  ]);

  res.json({
    news:      getMockNews(assets),
    prices,
    aiInsight,
    meme:      getRandomMeme(assets),
  });
}

module.exports = { getDashboard };
