import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Journal() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reviews/my')
      .then((r) => setReviews(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  async function remove(id) {
    if (!confirm('Delete review?')) return;
    await api.delete(`/reviews/${id}`);
    setReviews(reviews.filter((r) => r._id !== id));
  }

  return (
    <div className="container">
      <h2 className="section-title">My Journal</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="empty">No reviews yet. Watch something and share your thoughts!</div>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="review-card">
            <div className="author" style={{ cursor: 'pointer' }} onClick={() => navigate(`/movie/${r.tmdbType}/${r.tmdbId}`)}>
              {r.title}
            </div>
            <div className="rating">★ {r.rating}/10</div>
            <div className="text">{r.reviewText}</div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
              {new Date(r.createdAt).toLocaleDateString()}
              <button onClick={() => remove(r._id)} style={{ float: 'right', background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
