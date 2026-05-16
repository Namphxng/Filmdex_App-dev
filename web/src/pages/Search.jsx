import { useEffect, useState } from 'react';
import api from '../api.js';
import MovieCard from '../components/MovieCard.jsx';

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await api.get('/movies/search', { params: { q } });
        setResults(r.data.results || r.data.data || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="container">
      <input
        className="search-bar"
        placeholder="Search movies or series..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      {loading && <div className="loading">Searching...</div>}
      {!loading && q && results.length === 0 && <div className="empty">No results for "{q}"</div>}
      {results.length > 0 && (
        <div className="movie-grid">
          {results.map((m) => <MovieCard key={`${m.tmdbType || m.type}-${m.tmdbId}`} movie={m} />)}
        </div>
      )}
    </div>
  );
}
