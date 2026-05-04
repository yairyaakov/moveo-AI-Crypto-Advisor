const FALLBACK_INSIGHTS = [
  'The crypto market continues to show mixed signals. Your selected assets may be worth monitoring for consolidation patterns before any significant moves.',
  'Macro conditions and broader market sentiment could be relevant for your profile this week. Staying informed and patient tends to serve most investors well.',
  'Your portfolio selection covers a mix of established and emerging assets. Keeping an eye on volume trends and on-chain activity could provide useful context.',
];

function getFallbackInsight(assets, investorType) {
  const coinList = assets.join(', ');
  const horizon = investorType === 'long-term'
    ? 'long-term accumulation'
    : investorType === 'short-term'
    ? 'short-term trading'
    : 'balanced investing';

  return `${coinList} may be worth monitoring given current market conditions. For a ${horizon} approach, tracking volume and sentiment shifts could be relevant for your profile. As always, do your own research before making any decisions.`;
}

async function generateAIInsight({ assets, investorType, contentTypes }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return { id: 'insight-today', text: getFallbackInsight(assets, investorType), live: false };
  }

  const prompt = `You are a neutral crypto market analyst. Write a 2-3 sentence personalized daily insight for a ${investorType} crypto investor who holds ${assets.join(', ')}.
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
    return { id: 'insight-today', text: getFallbackInsight(assets, investorType), live: false };
  }
}

module.exports = { generateAIInsight };
