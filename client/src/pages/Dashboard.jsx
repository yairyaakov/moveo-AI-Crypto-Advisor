import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../api/dashboard';
import { submitVote } from '../api/votes';

function VoteButtons({ section, itemId }) {
  const [vote, setVote] = useState(null);

  async function handleVote(value) {
    const next = vote === value ? null : value;
    setVote(next);
    if (next !== null) {
      await submitVote({ section, itemId, value: next });
    }
  }

  return (
    <div className="vote-buttons">
      <button
        className={`vote-btn ${vote === 1 ? 'vote-active-up' : ''}`}
        onClick={() => handleVote(1)}
        title="Thumbs up"
      >👍</button>
      <button
        className={`vote-btn ${vote === -1 ? 'vote-active-down' : ''}`}
        onClick={() => handleVote(-1)}
        title="Thumbs down"
      >👎</button>
    </div>
  );
}

function SectionCard({ title, badge, children }) {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2>{title}</h2>
        {badge && <span className="live-badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard().then(res => {
      if (res.error) setError(res.error);
      else setData(res);
    });
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  if (error) return (
    <div className="dashboard-page">
      <p className="error">{error}</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );

  if (!data) return <div className="dashboard-page loading">Loading your dashboard...</div>;

  const { preferences, news, prices, aiInsight, meme } = data;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>AI Crypto Advisor</h1>
          <p className="dashboard-subtitle">
            Your daily dashboard · {preferences.investorType} investor ·{' '}
            {preferences.assets.join(', ')}
          </p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Log out</button>
      </header>

      <div className="dashboard-grid">

        {/* Market News */}
        <SectionCard title="📰 Market News" badge={news[0]?.live ? 'LIVE' : null}>
          <ul className="news-list">
            {news.map(item => (
              <li key={item.id} className="news-item">
                <div className="news-content">
                  <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                  <span className="news-meta">{item.source} · {item.relatedAsset}</span>
                </div>
                <VoteButtons section="news" itemId={item.id} />
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Coin Prices */}
        <SectionCard title="💰 Coin Prices" badge={prices[0]?.live ? 'LIVE' : null}>
          <ul className="prices-list">
            {prices.map(item => (
              <li key={item.id} className="price-item">
                <div className="price-info">
                  <span className="price-coin">{item.coin}</span>
                  <span className="price-name">{item.name}</span>
                </div>
                <div className="price-right">
                  <span className="price-value">
                    ${Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: item.price < 1 ? 6 : 2 })}
                  </span>
                  <VoteButtons section="prices" itemId={item.id} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* AI Insight */}
        <SectionCard title="🤖 AI Insight of the Day" badge={aiInsight.live ? 'AI' : null}>
          <p className="insight-text">{aiInsight.text}</p>
          <VoteButtons section="aiInsight" itemId={aiInsight.id} />
        </SectionCard>

        {/* Meme */}
        <SectionCard title="😂 Crypto Meme of the Day">
          <div className="meme-container">
            <img src={meme.imageUrl} alt={meme.title} className="meme-img" />
            <p className="meme-title">{meme.title}</p>
            <p className="meme-text">{meme.text}</p>
            <VoteButtons section="meme" itemId={meme.id} />
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
