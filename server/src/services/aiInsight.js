const CONTENT_FOCUS = {
  'market-news': 'recent market developments and news headlines',
  'charts':      'price action, momentum, and volume trends',
  'social':      'community sentiment, social activity, and market mood',
  'fun':         'an approachable and slightly lighter tone while staying professional',
};

function buildFocusHint(contentTypes) {
  if (!contentTypes || contentTypes.length === 0) return '';
  const hints = contentTypes
    .filter(t => CONTENT_FOCUS[t])
    .map(t => CONTENT_FOCUS[t]);
  return hints.length > 0 ? `Focus on ${hints.join(' and ')}.` : '';
}

function getFallbackInsight(assets, investorType, contentTypes) {
  const coinList = assets.join(', ');
  const horizon = investorType === 'long-term'
    ? 'long-term accumulation'
    : investorType === 'short-term'
    ? 'short-term trading'
    : 'balanced investing';

  const focus = contentTypes ?? [];

  if (focus.includes('charts')) {
    return `${coinList} price action may be worth watching for momentum shifts and volume patterns. For a ${horizon} approach, technical levels could be relevant context for your profile. As always, do your own research before making any decisions.`;
  }
  if (focus.includes('social')) {
    return `Community sentiment around ${coinList} has been an interesting signal to follow lately. For a ${horizon} investor, tracking social activity and broader market mood could be relevant for your profile. Stay informed and trust your process.`;
  }
  if (focus.includes('fun')) {
    return `${coinList} is keeping things interesting in the crypto space today. Whether you're HODLing or watching closely, staying curious and informed is always a good move for a ${horizon} approach. Do your own research — and enjoy the ride!`;
  }
  // default: market-news or no preference
  return `${coinList} may be worth monitoring given current market conditions. For a ${horizon} approach, keeping up with market developments and news could be relevant for your profile. As always, do your own research before making any decisions.`;
}

async function generateAIInsight({ assets, investorType, contentTypes }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return { id: 'insight-today', text: getFallbackInsight(assets, investorType, contentTypes), live: false };
  }

  const focusHint = buildFocusHint(contentTypes);

  const prompt = `You are a neutral crypto market analyst. Write a 2-3 sentence personalized daily insight for a ${investorType} crypto investor who holds ${assets.join(', ')}.
${focusHint}
Do not give financial advice. Do not tell them to buy or sell.
Use neutral language like "may be worth monitoring" or "could be relevant for your profile".
Be concise and helpful.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`OpenRouter responded with ${response.status}`);

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error('Empty response from OpenRouter');

    return { id: 'insight-today', text, live: true };
  } catch (err) {
    console.warn('AI insight failed, using fallback:', err.message);
    return { id: 'insight-today', text: getFallbackInsight(assets, investorType, contentTypes), live: false };
  }
}

module.exports = { generateAIInsight };
