from flask import Blueprint, request, jsonify, g

from services import movies_data
from middleware.auth import require_auth

bp = Blueprint('movies', __name__, url_prefix='/api/movies')


@bp.get('/trending')
def trending():
    return jsonify({'success': True, 'data': movies_data.get_trending()})


@bp.get('/search')
def search():
    q = request.args.get('q', '').strip()
    page = int(request.args.get('page', 1))
    if not q:
        return jsonify({'success': False, 'message': 'Search query is required'}), 400
    result = movies_data.search_multi(q, page)
    return jsonify({'success': True, **result})


@bp.get('/genres')
def genres():
    type_ = request.args.get('type', 'movie')
    return jsonify({'success': True, 'data': movies_data.get_genre_list(type_)})


@bp.get('/genre/<genre_id>')
def by_genre(genre_id):
    type_ = request.args.get('type', 'movie')
    page = int(request.args.get('page', 1))
    try:
        result = movies_data.get_by_genre(int(genre_id), type_, page)
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid genre id'}), 400
    return jsonify({'success': True, **result})


@bp.get('/recommendations')
@require_auth
def recommendations():
    """Recommend titles based on the user's favoriteGenres (simple version)."""
    favorites = g.user.get('favoriteGenres') or []
    if not favorites:
        return jsonify({'success': True, 'data': movies_data.get_trending()[:12]})

    matches = []
    for m in movies_data.MOVIES:
        if any(name in favorites for name in m.get('genreNames', [])):
            matches.append(movies_data._to_list_item(m))
    matches.sort(key=lambda x: x['popularity'], reverse=True)
    return jsonify({'success': True, 'data': matches[:20]})


@bp.get('/<movie_id>')
def detail(movie_id):
    movie = movies_data.get_movie_details(movie_id)
    if movie is None:
        return jsonify({'success': False, 'message': 'Movie not found'}), 404
    return jsonify({'success': True, 'data': movie})
