from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, g

from extensions import get_db
from helpers import serialize, to_object_id
from middleware.auth import require_auth

bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')


def _populate_user(reviews):
    """Attach { _id, username, avatar } as `userId` field on each review (mimics Mongoose populate)."""
    if not reviews:
        return reviews
    db = get_db()
    user_ids = list({r['userId'] for r in reviews})
    users = {u['_id']: u for u in db.users.find({'_id': {'$in': user_ids}})}
    out = []
    for r in reviews:
        u = users.get(r['userId'])
        r_copy = dict(r)
        if u is not None:
            r_copy['userId'] = {
                '_id': u['_id'],
                'username': u.get('username', ''),
                'avatar': u.get('avatar', ''),
            }
        out.append(r_copy)
    return out


@bp.get('/my')
@require_auth
def my_reviews():
    db = get_db()
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    skip = (page - 1) * limit
    total = db.reviews.count_documents({'userId': g.user['_id']})
    reviews = list(
        db.reviews.find({'userId': g.user['_id']})
        .sort('createdAt', -1).skip(skip).limit(limit)
    )
    return jsonify({
        'success': True,
        'data': serialize(reviews),
        'total': total,
        'page': page,
        'totalPages': max(1, -(-total // limit)),
    })


@bp.get('/<movie_id>')
def by_movie(movie_id):
    db = get_db()
    type_ = request.args.get('type', 'movie')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    skip = (page - 1) * limit
    try:
        tmdb_id = int(movie_id)
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid movie id'}), 400

    query = {'tmdbId': tmdb_id, 'tmdbType': type_}
    total = db.reviews.count_documents(query)
    reviews = list(db.reviews.find(query).sort('createdAt', -1).skip(skip).limit(limit))
    reviews = _populate_user(reviews)
    avg = (sum(r['rating'] for r in reviews) / len(reviews)) if reviews else 0

    return jsonify({
        'success': True,
        'data': serialize(reviews),
        'averageRating': round(avg * 10) / 10,
        'total': total,
        'page': page,
        'totalPages': max(1, -(-total // limit)),
    })


@bp.post('')
@require_auth
def create():
    body = request.get_json(silent=True) or {}
    tmdb_id = body.get('tmdbId')
    tmdb_type = body.get('tmdbType')
    title = body.get('title', '')
    rating = body.get('rating')
    review_text = body.get('reviewText', '')

    if tmdb_id is None or tmdb_type not in ('movie', 'tv'):
        return jsonify({'success': False, 'message': 'tmdbId and tmdbType (movie|tv) required'}), 400
    if not isinstance(rating, int) or rating < 1 or rating > 10:
        return jsonify({'success': False, 'message': 'Rating must be an integer 1-10'}), 400
    if len(review_text) > 2000:
        return jsonify({'success': False, 'message': 'Review too long (max 2000 chars)'}), 400

    db = get_db()
    if db.reviews.find_one({'userId': g.user['_id'], 'tmdbId': tmdb_id}):
        return jsonify({'success': False, 'message': 'You have already reviewed this title'}), 400

    now = datetime.now(timezone.utc)
    doc = {
        'userId': g.user['_id'],
        'tmdbId': tmdb_id,
        'tmdbType': tmdb_type,
        'title': title,
        'rating': rating,
        'reviewText': review_text,
        'createdAt': now,
        'updatedAt': now,
    }
    result = db.reviews.insert_one(doc)
    doc['_id'] = result.inserted_id
    populated = _populate_user([doc])[0]
    return jsonify({'success': True, 'data': serialize(populated)}), 201


@bp.put('/<review_id>')
@require_auth
def update(review_id):
    oid = to_object_id(review_id)
    if oid is None:
        return jsonify({'success': False, 'message': 'Invalid id'}), 400
    body = request.get_json(silent=True) or {}
    rating = body.get('rating')
    review_text = body.get('reviewText', '')
    if not isinstance(rating, int) or rating < 1 or rating > 10:
        return jsonify({'success': False, 'message': 'Rating must be an integer 1-10'}), 400

    db = get_db()
    update = {
        'rating': rating,
        'reviewText': review_text,
        'updatedAt': datetime.now(timezone.utc),
    }
    result = db.reviews.find_one_and_update(
        {'_id': oid, 'userId': g.user['_id']},
        {'$set': update},
    )
    if not result:
        return jsonify({'success': False, 'message': 'Review not found'}), 404
    review = db.reviews.find_one({'_id': oid})
    populated = _populate_user([review])[0]
    return jsonify({'success': True, 'data': serialize(populated)})


@bp.delete('/<review_id>')
@require_auth
def delete(review_id):
    oid = to_object_id(review_id)
    if oid is None:
        return jsonify({'success': False, 'message': 'Invalid id'}), 400
    db = get_db()
    result = db.reviews.delete_one({'_id': oid, 'userId': g.user['_id']})
    if result.deleted_count == 0:
        return jsonify({'success': False, 'message': 'Review not found'}), 404
    return jsonify({'success': True, 'message': 'Review deleted'})
