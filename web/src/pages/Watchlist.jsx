import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const STATUSES = [
  { key: 'planned', label: 'Plan to Watch' },
  { key: 'watching', label: 'Watching' },
  { key: 'watched', label: 'Watched' },
];

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1a23"/></svg>';

export default function Watchlist() {
  const [tab, setTab] = useState('planned');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/watchlist', { params: { status: tab } });
      setItems(r.data.data || []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [tab]);

  async function remove(id) {
    if (!confirm('Remove from watchlist?')) return;
    await api.delete(`/watchlist/${id}`);
    load();
  }

  async function changeStatus(id, status) {
    await api.put(`/watchlist/${id}`, { status });
    load();
  }

  return (
    <div className="container">
      <h2 className="section-title">My Watchlist</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setTab(s.key)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: '1px solid #2a2a35',
              background: tab === s.key ? '#f5c518' : 'transparent',
              color: tab === s.key ? '#000' : '#aaa',
              fontWeight: 600,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : items.length === 0 ? (
        <div className="empty">Nothing here yet. Add titles from the search page!</div>
      ) : (
        <div className="movie-grid">
          {items.map((item) => {
            const poster = item.poster;
            const posterUrl = poster
              ? (poster.startsWith('http') ? poster : `https://image.tmdb.org/t/p/w342${poster}`)
              : PLACEHOLDER;
            return (
              <div key={item._id} className="movie-card">
                <img src={posterUrl} alt={item.title} onClick={() => navigate(`/movie/${item.tmdbType}/${item.tmdbId}`)} />
                <div className="info">
                  <div className="title">{item.title}</div>
                  {tab === 'watched' && item.watchedAt && (
                    <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>
                      Watched {new Date(item.watchedAt).toLocaleDateString()}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <select
                      value={item.status}
                      onChange={(e) => changeStatus(item._id, e.target.value)}
                      style={{ flex: 1, padding: 4, fontSize: 11, background: '#0f0f14', color: '#fff', border: '1px solid #2a2a35', borderRadius: 4 }}
                    >
                      {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                    <button onClick={() => remove(item._id)} style={{ padding: 4, background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', borderRadius: 4, fontSize: 11 }}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
