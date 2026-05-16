import { useEffect, useState } from 'react';
import api from '../api.js';
import MovieCard from '../components/MovieCard.jsx';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/movies/trending')
      .then((r) => setTrending(r.data.data || []))
      .catch(() => setTrending([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h2 className="section-title">Trending Now</h2>
      {loading ? (
        <div className="loading">Loading trending titles...</div>
      ) : trending.length === 0 ? (
        <div className="empty">No trending data available.</div>
      ) : (
        <div className="movie-grid">
          {trending.map((m) => <MovieCard key={`${m.tmdbType || m.type}-${m.tmdbId}`} movie={m} />)}
        </div>
      )}
    </div>
  );
}
