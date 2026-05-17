import { useEffect, useState } from 'react';
import api from '../api.js';
import MovieCard from '../components/MovieCard.jsx';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/movies/trending').catch(() => ({ data: { data: [] } })),
      api.get('/movies/recommendations').catch(() => ({ data: { data: [] } })),
    ]).then(([trendingRes, recRes]) => {
      setTrending(trendingRes.data.data || []);
      setRecommended(recRes.data.data || []);
    }).finally(() => setLoading(false));
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

      {recommended.length > 0 && (
        <>
          <h2 className="section-title" style={{ marginTop: 40 }}>Recommended For You</h2>
          <div className="movie-grid">
            {recommended.map((m) => <MovieCard key={`rec-${m.tmdbType || m.type}-${m.tmdbId}`} movie={m} />)}
          </div>
        </>
      )}
    </div>
  );
}
