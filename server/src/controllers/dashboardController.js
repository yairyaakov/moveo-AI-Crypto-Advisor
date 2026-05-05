const prisma = require('../config/prisma');
const { fetchPrices } = require('../services/cryptoPrices');
const { fetchCryptoNews } = require('../services/cryptoNews');
const { generateAIInsight } = require('../services/aiInsight');
const { getRandomMeme } = require('../services/meme');

async function getDashboard(req, res) {
  try {
    const userId = req.user.id;

    const preference = await prisma.preference.findUnique({ where: { userId } });

    if (!preference) {
      return res.status(400).json({ error: 'Onboarding not completed. Please complete the onboarding quiz first.' });
    }

    const assets = JSON.parse(preference.assets);
    const contentTypes = JSON.parse(preference.contentTypes);
    const { investorType } = preference;

    const [news, prices, aiInsight] = await Promise.all([
      fetchCryptoNews(assets, contentTypes),
      fetchPrices(assets),
      generateAIInsight({ assets, investorType, contentTypes }),
    ]);

    res.json({
      preferences: { assets, investorType, contentTypes },
      news,
      prices,
      aiInsight,
      meme: getRandomMeme(assets),
    });
  } catch {
    res.status(500).json({ error: 'Failed to load dashboard. Please try again.' });
  }
}

module.exports = { getDashboard };
