import { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const ALL_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'History', 'Horror',
  'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War',
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({ reviews: 0, watching: 0, watched: 0 });
  const [editing, setEditing] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/auth/profile').then(({ data }) => updateUser(data.user)).catch(() => {});
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

  const handleEdit = () => {
    setSelectedGenres(user?.favoriteGenres || []);
    setEditing(true);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { favoriteGenres: selectedGenres });
      updateUser(data.user);
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

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

      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Favorite Genres</h3>
          {!editing && (
            <button onClick={handleEdit} style={{ background: 'none', border: '1px solid #333', color: '#aaa', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {ALL_GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                    backgroundColor: selectedGenres.includes(g) ? '#f5c518' : '#1a1a1a',
                    color: selectedGenres.includes(g) ? '#000' : '#ccc',
                    border: `1px solid ${selectedGenres.includes(g) ? '#f5c518' : '#2a2a2a'}`,
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} style={{ background: 'none', border: '1px solid #333', color: '#aaa', padding: '8px 20px', borderRadius: 8, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(user?.favoriteGenres || []).length === 0 ? (
              <p style={{ color: '#555', fontSize: 14 }}>No favorite genres set. Click Edit to add some.</p>
            ) : (
              user.favoriteGenres.map(g => (
                <span key={g} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ccc', padding: '6px 14px', borderRadius: 20, fontSize: 13 }}>
                  {g}
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
