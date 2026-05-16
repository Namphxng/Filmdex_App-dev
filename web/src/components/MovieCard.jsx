import { useNavigate } from 'react-router-dom';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1a23"/><text x="100" y="150" text-anchor="middle" fill="%23555" font-size="14">No Image</text></svg>';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const type = movie.tmdbType || movie.type || 'movie';
  const id = movie.tmdbId || movie.id;
  const poster = movie.poster || movie.posterPath;
  const posterUrl = poster ? (poster.startsWith('http') ? poster : `https://image.tmdb.org/t/p/w342${poster}`) : PLACEHOLDER;
  const title = movie.title || movie.name;
  const year = movie.releaseYear || (movie.releaseDate || '').slice(0, 4);
  const rating = (movie.rating ?? movie.voteAverage ?? 0).toFixed(1);

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${type}/${id}`)}>
      <img src={posterUrl} alt={title} onError={(e) => { e.target.src = PLACEHOLDER; }} />
      <div className="info">
        <div className="title">{title}</div>
        <div className="meta">
          <span className="rating">★ {rating}</span> · {year || '—'}
        </div>
      </div>
    </div>
  );
}
