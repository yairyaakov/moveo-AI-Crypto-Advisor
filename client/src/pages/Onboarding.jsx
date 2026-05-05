import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePreferences } from '../api/onboarding';

const ASSET_OPTIONS = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 'XRP', 'BNB'];
const INVESTOR_TYPES = [
  { value: 'long-term',  label: 'Long-term holder (HODL)' },
  { value: 'short-term', label: 'Short-term trader' },
  { value: 'balanced',   label: 'Balanced investor' },
];
const CONTENT_OPTIONS = [
  { value: 'news',   label: 'Market News' },
  { value: 'prices', label: 'Coin Prices' },
  { value: 'ai',     label: 'AI Insights' },
  { value: 'memes',  label: 'Crypto Memes' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [investorType, setInvestorType] = useState('');
  const [contentTypes, setContentTypes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleItem(list, setList, value) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (assets.length === 0) return setError('Please select at least one asset.');
    if (!investorType) return setError('Please select your investor type.');
    if (contentTypes.length === 0) return setError('Please select at least one content type.');

    setError('');
    setLoading(true);
    const data = await savePreferences({ assets, investorType, contentTypes });
    setLoading(false);

    if (data.error) return setError(data.error);
    navigate('/dashboard');
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <h1>Welcome! Let's personalize your dashboard.</h1>
        <form onSubmit={handleSubmit}>

          <section>
            <h3>Which crypto assets are you interested in?</h3>
            <div className="chip-group">
              {ASSET_OPTIONS.map(coin => (
                <button
                  key={coin}
                  type="button"
                  className={`chip ${assets.includes(coin) ? 'chip-selected' : ''}`}
                  onClick={() => toggleItem(assets, setAssets, coin)}
                >
                  {coin}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>What type of investor are you?</h3>
            <div className="radio-group">
              {INVESTOR_TYPES.map(opt => (
                <label key={opt.value} className="radio-label">
                  <input
                    type="radio"
                    name="investorType"
                    value={opt.value}
                    checked={investorType === opt.value}
                    onChange={e => setInvestorType(e.target.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3>What kind of content do you want to see?</h3>
            <div className="chip-group">
              {CONTENT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`chip ${contentTypes.includes(opt.value) ? 'chip-selected' : ''}`}
                  onClick={() => toggleItem(contentTypes, setContentTypes, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Go to my dashboard →'}
          </button>
        </form>
      </div>
    </div>
  );
}
