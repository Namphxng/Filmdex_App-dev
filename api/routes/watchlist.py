from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, g

from extensions import get_db
from helpers import serialize, to_object_id
from middleware.auth import require_auth

bp = Blueprint('watchlist', __name__, url_prefix='/api/watchlist')


VALID_STATUSES = {'planned', 'watching', 'watched'}


@bp.get('')
@require_auth
def list_items():
    db = get_db()
    status = request.args.get('status')
    query = {'userId': g.user['_id']}
    if status:
        query['status'] = status
    items = list(db.watchlists.find(query).sort('addedAt', -1))
    return jsonify({'success': True, 'data': serialize(items), 'count': len(items)})


@bp.post('')
@require_auth
def add_item():
    body = request.get_json(silent=True) or {}
    tmdb_id = body.get('tmdbId')
    tmdb_type = body.get('tmdbType')
    title = body.get('title')
    poster = body.get('poster', '')
    status = body.get('status', 'planned')

    if tmdb_id is None or tmdb_type not in ('movie', 'tv') or not title:
        return jsonify({'success': False, 'message': 'tmdbId, tmdbType (movie|tv), title required'}), 400
    if status not in VALID_STATUSES:
        return jsonify({'success': False, 'message': 'Invalid status'}), 400

    db = get_db()
    existing = db.watchlists.find_one({'userId': g.user['_id'], 'tmdbId': tmdb_id})
    if existing:
        return jsonify({'success': False, 'message': 'Already in watchlist'}), 400

    now = datetime.now(timezone.utc)
    doc = {
        'userId': g.user['_id'],
        'tmdbId': tmdb_id,
        'tmdbType': tmdb_type,
        'title': title,
        'poster': poster,
        'status': status,
        'addedAt': now,
        'watchedAt': now if status == 'watched' else None,
        'createdAt': now,
        'updatedAt': now,
    }
    result = db.watchlists.insert_one(doc)
    doc['_id'] = result.inserted_id
    return jsonify({'success': True, 'data': serialize(doc)}), 201


@bp.put('/<item_id>')
@require_auth
def update_item(item_id):
    oid = to_object_id(item_id)
    if oid is None:
        return jsonify({'success': False, 'message': 'Invalid id'}), 400
    body = request.get_json(silent=True) or {}
    status = body.get('status')
    if status not in VALID_STATUSES:
        return jsonify({'success': False, 'message': 'Invalid status'}), 400

    db = get_db()
    update = {'status': status, 'updatedAt': datetime.now(timezone.utc)}
    if status == 'watched':
        update['watchedAt'] = datetime.now(timezone.utc)
    result = db.watchlists.find_one_and_update(
        {'_id': oid, 'userId': g.user['_id']},
        {'$set': update},
        return_document=True,
    )
    if not result:
        return jsonify({'success': False, 'message': 'Watchlist item not found'}), 404
    item = db.watchlists.find_one({'_id': oid})
    return jsonify({'success': True, 'data': serialize(item)})


@bp.delete('/<item_id>')
@require_auth
def delete_item(item_id):
    oid = to_object_id(item_id)
    if oid is None:
        return jsonify({'success': False, 'message': 'Invalid id'}), 400
    db = get_db()
    result = db.watchlists.delete_one({'_id': oid, 'userId': g.user['_id']})
    if result.deleted_count == 0:
        return jsonify({'success': False, 'message': 'Watchlist item not found'}), 404
    return jsonify({'success': True, 'message': 'Removed from watchlist'})
