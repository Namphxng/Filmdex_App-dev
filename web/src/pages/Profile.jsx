import { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ reviews: 0, watching: 0, watched: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/reviews/my').catch(() => ({ data: { data: [] } })),
      api.get('/watchlist', { params: { status: 'watching' } }).catch(() => ({ data: { data: [] } })),
      api.get('/watchlist', { params: { status: 'watched' } }).catch(() => ({ data: { data: [] } })),
    ]).then(([r, w, c]) => {
      setStats({
        reviews: (r.data.data || []).length,
        watching: (w.data.data || []).length,
        watched: (c.data.data || []).length,
      });
    });
  }, []);

  const initial = (user?.username || '?').charAt(0).toUpperCase();

  return (
    <div className="container">
      <div className="profile-header">
        <div className="avatar">{initial}</div>
        <div>
          <h2 style={{ fontSize: 24 }}>{user?.username}</h2>
          <div style={{ color: '#888', fontSize: 14 }}>{user?.email}</div>
          <div className="stats">
            <div><strong style={{ color: '#fff' }}>{stats.reviews}</strong> reviews</div>
            <div><strong style={{ color: '#fff' }}>{stats.watching}</strong> watching</div>
            <div><strong style={{ color: '#fff' }}>{stats.watched}</strong> watched</div>
          </div>
        </div>
      </div>
      <p style={{ color: '#888', textAlign: 'center' }}>
        Your activity is tracked across the Journal and Watchlist tabs.
      </p>
    </div>
  );
}
