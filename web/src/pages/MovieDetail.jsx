import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1a23"/></svg>';

export default function MovieDetail() {
  const { type, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [m, r] = await Promise.all([
        api.get(`/movies/${id}`, { params: { type } }),
        api.get(`/reviews/${id}`, { params: { type } }).catch(() => ({ data: { data: [] } })),
      ]);
      setMovie(m.data.data);
      setReviews(r.data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [type, id]);

  async function addToWatchlist(status) {
    setMsg('');
    try {
      await api.post('/watchlist', {
        tmdbId: Number(id),
        tmdbType: type,
        title: movie.title || movie.name,
        poster: movie.poster || movie.posterPath,
        status,
      });
      setMsg(`Added to ${status}!`);
    } catch (ex) {
      setMsg(ex.response?.data?.message || 'Failed to add.');
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post('/reviews', {
        tmdbId: Number(id),
        tmdbType: type,
        title: movie.title || movie.name,
        rating: Number(rating),
        reviewText: text,
      });
      setText('');
      setRating(5);
      await load();
    } catch (ex) {
      alert(ex.response?.data?.message || 'Failed to post review.');
    } finally {
      setPosting(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="empty">Not found.</div>;

  const poster = movie.poster || movie.posterPath;
  const posterUrl = poster ? (poster.startsWith('http') ? poster : `https://image.tmdb.org/t/p/w500${poster}`) : PLACEHOLDER;
  const title = movie.title || movie.name;
  const year = movie.releaseYear || (movie.releaseDate || '').slice(0, 4);
  const genres = Array.isArray(movie.genres) ? movie.genres.map((g) => g.name || g).join(', ') : '';

  return (
    <div className="container">
      <div className="detail-hero">
        <img src={posterUrl} alt={title} />
        <div className="info">
          <h1>{title}</h1>
          {movie.tagline && <div className="tagline">{movie.tagline}</div>}
          <div className="meta-row">
            <span>★ {(movie.rating ?? movie.voteAverage ?? 0).toFixed(1)}</span>
            <span>{year}</span>
            {genres && <span>{genres}</span>}
          </div>
          <p className="overview">{movie.overview}</p>
          <div className="actions">
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => addToWatchlist('planned')}>+ Plan to Watch</button>
            <button className="btn-secondary" onClick={() => addToWatchlist('watching')}>Watching</button>
            <button className="btn-secondary" onClick={() => addToWatchlist('watched')}>Watched</button>
          </div>
          {msg && <div style={{ marginTop: 12, color: '#f5c518' }}>{msg}</div>}
        </div>
      </div>

      <h2 className="section-title">Write a Review</h2>
      <form className="review-form" onSubmit={submitReview}>
        <label>Rating: </label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n} ★</option>)}
        </select>
        <textarea placeholder="Your thoughts..." value={text} onChange={(e) => setText(e.target.value)} required minLength={1} />
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} disabled={posting}>{posting ? 'Posting...' : 'Post Review'}</button>
      </form>

      <h2 className="section-title">Reviews</h2>
      {reviews.length === 0 ? (
        <div className="empty">No reviews yet — be the first.</div>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="review-card">
            <div className="author">{r.userId?.username || 'anonymous'}</div>
            <div className="rating">★ {r.rating}/10</div>
            <div className="text">{r.reviewText}</div>
          </div>
        ))
      )}
    </div>
  );
}
