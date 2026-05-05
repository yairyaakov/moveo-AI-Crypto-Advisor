const FALLBACK_HEADLINES = {
  BTC:  [
    'Bitcoin consolidates near key support level as market watches macro data',
    'Institutional BTC holdings reach new quarterly high',
  ],
  ETH:  [
    'Ethereum developer activity rises ahead of next network upgrade',
    'ETH staking rewards attract growing interest from retail investors',
  ],
  SOL:  [
    'Solana network sees surge in daily active addresses',
    'SOL ecosystem projects raise fresh funding amid market recovery',
  ],
  DOGE: [
    'Dogecoin community rallies around new utility proposals',
    'DOGE trading volume spikes following social media attention',
  ],
  ADA:  [
    'Cardano rolls out governance update with community vote',
    'ADA sees increased on-chain activity in emerging markets',
  ],
  XRP:  [
    'XRP legal clarity continues to attract payment sector partnerships',
    'Ripple expands cross-border payment corridors in Asia',
  ],
  BNB:  [
    'BNB Chain reports record weekly transactions',
    'Binance ecosystem projects drive BNB demand',
  ],
};

const FALLBACK_SOURCES = ['CoinDesk', 'CryptoNews', 'The Block', 'Decrypt', 'BeInCrypto'];

function buildFallbackNews(assets) {
  const items = [];

  for (const coin of assets) {
    const headlines = FALLBACK_HEADLINES[coin] ?? [
      `${coin} market activity picks up as investors reassess positions`,
    ];

    headlines.slice(0, 2).forEach((title, i) => {
      items.push({
        id: `news-${coin}-${i + 1}`,
        title,
        source: FALLBACK_SOURCES[items.length % FALLBACK_SOURCES.length],
        url: `https://coindesk.com/search?q=${coin}`,
        relatedAsset: coin,
        live: false,
      });
    });
  }

  return items.slice(0, 5);
}

async function fetchCryptoNews(assets) {
  const apiKey = process.env.CRYPTOPANIC_API_KEY;

  if (!apiKey) return buildFallbackNews(assets);

  try {
    const currencies = assets.join(',');
    const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${apiKey}&currencies=${currencies}&public=true&kind=news`;

    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });

    if (!response.ok) throw new Error(`CryptoPanic responded with ${response.status}`);

    const data = await response.json();
    const posts = data.results ?? [];

    if (posts.length === 0) return buildFallbackNews(assets);

    return posts.slice(0, 5).map((post, i) => ({
      id: `news-live-${post.id ?? i}`,
      title: post.title,
      source: post.source?.title ?? 'CryptoPanic',
      url: post.url,
      relatedAsset: post.currencies?.[0]?.code ?? assets[0],
      live: true,
    }));
  } catch (err) {
    console.warn('CryptoPanic fetch failed, using fallback:', err.message);
    return buildFallbackNews(assets);
  }
}

module.exports = { fetchCryptoNews };
