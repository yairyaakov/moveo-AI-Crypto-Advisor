const SYMBOL_TO_ID = {
  BTC:  'bitcoin',
  ETH:  'ethereum',
  SOL:  'solana',
  DOGE: 'dogecoin',
  ADA:  'cardano',
  XRP:  'ripple',
  BNB:  'binancecoin',
};

const FALLBACK_PRICES = {
  BTC:  { name: 'Bitcoin',    price: 62450.12 },
  ETH:  { name: 'Ethereum',   price: 3021.88  },
  SOL:  { name: 'Solana',     price: 142.55   },
  DOGE: { name: 'Dogecoin',   price: 0.1423   },
  ADA:  { name: 'Cardano',    price: 0.4512   },
  XRP:  { name: 'XRP',        price: 0.5231   },
  BNB:  { name: 'BNB',        price: 589.30   },
};

async function fetchPrices(assets) {
  const ids = assets
    .filter(symbol => SYMBOL_TO_ID[symbol])
    .map(symbol => SYMBOL_TO_ID[symbol]);

  if (ids.length === 0) return buildFallback(assets);

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) throw new Error(`CoinGecko responded with ${response.status}`);

    const data = await response.json();

    // Map results back to the user's symbols
    return assets.map(symbol => {
      const geckoId = SYMBOL_TO_ID[symbol];
      const livePrice = geckoId && data[geckoId]?.usd;
      const fallback = FALLBACK_PRICES[symbol] ?? { name: symbol, price: 0 };
      return {
        id:    `price-${symbol}`,
        coin:  symbol,
        name:  fallback.name,
        price: livePrice ?? fallback.price,
        live:  !!livePrice,
      };
    });
  } catch {
    console.warn('CoinGecko fetch failed, using fallback prices');
    return buildFallback(assets);
  }
}

function buildFallback(assets) {
  return assets.map(symbol => {
    const fallback = FALLBACK_PRICES[symbol] ?? { name: symbol, price: 0 };
    return { id: `price-${symbol}`, coin: symbol, ...fallback, live: false };
  });
}

module.exports = { fetchPrices };
