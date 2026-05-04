// Placeholder — will call external APIs and return real data once services are wired up

function getDashboard(req, res) {
  res.json({
    news: [{ id: 1, title: 'Placeholder news headline', source: 'CryptoPanic' }],
    prices: [{ coin: 'BTC', price: 60000 }, { coin: 'ETH', price: 3000 }],
    aiInsight: 'Placeholder AI insight of the day.',
    meme: { url: 'https://placeholder.com/meme.jpg', title: 'Placeholder meme' },
  });
}

module.exports = { getDashboard };
