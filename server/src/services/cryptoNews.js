// Keyword sets used to locally re-rank live CryptoPanic results by contentType
const CONTENT_KEYWORDS = {
  'charts':      ['price', 'volume', 'trend', 'support', 'resistance', 'momentum', 'breakout', 'chart', 'technical'],
  'social':      ['community', 'sentiment', 'social', 'adoption', 'users', 'holders', 'twitter', 'reddit', 'viral'],
  'market-news': ['market', 'report', 'analysis', 'fund', 'etf', 'institutional', 'regulation', 'economy'],
  'fun':         ['fun', 'meme', 'community', 'viral', 'culture', 'buzz'],
};

// Fallback headlines keyed by [contentType][coin]
const FALLBACK = {
  'charts': {
    BTC:  ['BTC tests key resistance as trading volume surges', 'Bitcoin price action signals possible breakout from consolidation zone'],
    ETH:  ['ETH volume spikes near major support level', 'Ethereum momentum builds as buyers defend trend line'],
    SOL:  ['SOL chart shows bullish structure after recent pullback', 'Solana price targets higher resistance after volume uptick'],
    DOGE: ['DOGE breaks short-term resistance amid rising volume', 'Dogecoin momentum watch: key levels to track this week'],
    ADA:  ['ADA price action consolidates near critical support', 'Cardano volume trend suggests accumulation phase'],
    XRP:  ['XRP tests multi-week resistance amid steady volume', 'Ripple price trend remains cautious near key level'],
    BNB:  ['BNB technical setup points to range compression', 'Binance Coin volume signals possible directional move'],
  },
  'social': {
    BTC:  ['Bitcoin community sentiment turns cautiously optimistic', 'BTC social activity rises as retail interest returns'],
    ETH:  ['Ethereum developer community rallies around upcoming upgrade', 'ETH adoption growing among new wallet holders'],
    SOL:  ['Solana community celebrates ecosystem milestone', 'SOL social buzz grows as new projects launch on-chain'],
    DOGE: ['Dogecoin community launches new utility initiative', 'DOGE holder sentiment positive despite market uncertainty'],
    ADA:  ['Cardano governance vote draws strong community participation', 'ADA community sentiment improves with new roadmap update'],
    XRP:  ['XRP community reacts to latest partnership announcement', 'Ripple social momentum builds in emerging markets'],
    BNB:  ['BNB ecosystem projects drive community engagement', 'Binance community highlights new DeFi integrations'],
  },
  'fun': {
    BTC:  ['Bitcoin hits the headlines again as retail buzz picks up', 'BTC culture moment: meme coins follow Bitcoin\'s lead'],
    ETH:  ['Ethereum community celebrates another network milestone', 'ETH holders share viral reactions to latest price move'],
    SOL:  ['Solana buzzes with new meme coin launches and community events', 'SOL ecosystem goes viral as new projects gain traction'],
    DOGE: ['Dogecoin culture thrives as community marks another anniversary', 'DOGE buzz grows again with fresh meme activity online'],
    ADA:  ['Cardano community rallies with fresh enthusiasm around governance', 'ADA holders celebrate ecosystem growth with community events'],
    XRP:  ['XRP community buzz intensifies around latest network news', 'Ripple culture moment as community marks key milestone'],
    BNB:  ['BNB ecosystem fun: community highlights top projects this week', 'Binance community event draws viral attention across crypto Twitter'],
  },
  'market-news': {
    BTC:  ['Bitcoin consolidates near key support as macro data looms', 'Institutional BTC holdings reach new quarterly high'],
    ETH:  ['Ethereum developer activity rises ahead of next upgrade', 'ETH staking rewards attract growing institutional interest'],
    SOL:  ['Solana network sees surge in daily active addresses', 'SOL ecosystem raises fresh funding amid market recovery'],
    DOGE: ['Dogecoin community rallies around new utility proposals', 'DOGE trading volume spikes following social media attention'],
    ADA:  ['Cardano rolls out governance update with community vote', 'ADA sees increased on-chain activity in emerging markets'],
    XRP:  ['XRP legal clarity continues to attract payment partnerships', 'Ripple expands cross-border payment corridors in Asia'],
    BNB:  ['BNB Chain reports record weekly transactions', 'Binance ecosystem projects drive BNB demand'],
  },
};

const SOURCES = ['CoinDesk', 'CryptoNews', 'The Block', 'Decrypt', 'BeInCrypto'];

function getPrimaryContentType(contentTypes) {
  const priority = ['charts', 'social', 'fun', 'market-news'];
  return priority.find(t => contentTypes?.includes(t)) ?? 'market-news';
}

function buildFallbackNews(assets, contentTypes) {
  const type = getPrimaryContentType(contentTypes);
  const typeMap = FALLBACK[type] ?? FALLBACK['market-news'];
  const items = [];

  for (const coin of assets) {
    const headlines = typeMap[coin] ?? [
      `${coin} market activity picks up as investors reassess positions`,
      `Analysts monitor ${coin} amid broader market developments`,
    ];

    headlines.forEach((title, i) => {
      items.push({
        id:           `news-${coin}-${i + 1}`,
        title,
        source:       SOURCES[items.length % SOURCES.length],
        url:          `https://coindesk.com/search?q=${coin}`,
        relatedAsset: coin,
        live:         false,
      });
    });
  }

  return items.slice(0, 5);
}

function scorePost(title, contentTypes) {
  if (!contentTypes || contentTypes.length === 0) return 0;
  const lower = title.toLowerCase();
  let score = 0;
  for (const type of contentTypes) {
    const keywords = CONTENT_KEYWORDS[type] ?? [];
    score += keywords.filter(kw => lower.includes(kw)).length;
  }
  return score;
}

async function fetchCryptoNews(assets, contentTypes) {
  const apiKey = process.env.CRYPTOPANIC_API_KEY;

  if (!apiKey) return buildFallbackNews(assets, contentTypes);

  try {
    const currencies = assets.join(',');
    const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${apiKey}&currencies=${currencies}&public=true&kind=news`;

    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });

    if (!response.ok) throw new Error(`CryptoPanic responded with ${response.status}`);

    const data = await response.json();
    const posts = data.results ?? [];

    if (posts.length === 0) return buildFallbackNews(assets, contentTypes);

    // Sort by keyword relevance to selected contentTypes, keep original order as tiebreaker
    const scored = posts.map((post, i) => ({
      post,
      score: scorePost(post.title, contentTypes),
      index: i,
    }));
    scored.sort((a, b) => b.score - a.score || a.index - b.index);

    return scored.slice(0, 5).map(({ post, index }) => ({
      id:           `news-live-${post.id ?? index}`,
      title:        post.title,
      source:       post.source?.title ?? 'CryptoPanic',
      url:          post.url,
      relatedAsset: post.currencies?.[0]?.code ?? assets[0],
      live:         true,
    }));
  } catch (err) {
    console.warn('CryptoPanic fetch failed, using fallback:', err.message);
    return buildFallbackNews(assets, contentTypes);
  }
}

module.exports = { fetchCryptoNews };
