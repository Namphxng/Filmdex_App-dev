from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, g
from pymongo.errors import DuplicateKeyError

from extensions import get_db
from helpers import serialize
from middleware.auth import require_auth, verify_firebase_token

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.post('/register')
def register():
    """Called by the frontend AFTER a successful Firebase signup.

    The frontend has already created the Firebase account; this endpoint
    creates the matching Mongo user profile with a chosen username.
    """
    decoded, err = verify_firebase_token()
    if err:
        return jsonify({'success': False, 'message': err}), 401

    body = request.get_json(silent=True) or {}
    username = (body.get('username') or '').strip()
    bio = body.get('bio', '') or ''
    favorite_genres = body.get('favoriteGenres', []) or []

    if len(username) < 3 or len(username) > 30:
        return jsonify({'success': False, 'message': 'Username must be 3-30 characters'}), 400

    db = get_db()
    if db.users.find_one({'firebaseUid': decoded['uid']}):
        return jsonify({'success': False, 'message': 'Profile already exists'}), 400
    if db.users.find_one({'username': username}):
        return jsonify({'success': False, 'message': 'Username taken'}), 400

    now = datetime.now(timezone.utc)
    doc = {
        'firebaseUid': decoded['uid'],
        'email': (decoded.get('email') or '').lower(),
        'username': username,
        'avatar': '',
        'bio': bio,
        'favoriteGenres': favorite_genres,
        'followers': [],
        'following': [],
        'createdAt': now,
        'updatedAt': now,
    }
    try:
        result = db.users.insert_one(doc)
        doc['_id'] = result.inserted_id
    except DuplicateKeyError:
        return jsonify({'success': False, 'message': 'Username or email already taken'}), 400

    return jsonify({'success': True, 'user': serialize(doc)}), 201


@bp.get('/profile')
@require_auth
def get_profile():
    return jsonify({'success': True, 'user': serialize(g.user)})


@bp.put('/profile')
@require_auth
def update_profile():
    body = request.get_json(silent=True) or {}
    update = {}
    for field in ('bio', 'avatar', 'favoriteGenres'):
        if field in body:
            update[field] = body[field]
    if not update:
        return jsonify({'success': True, 'user': serialize(g.user)})

    update['updatedAt'] = datetime.now(timezone.utc)
    db = get_db()
    db.users.update_one({'_id': g.user['_id']}, {'$set': update})
    user = db.users.find_one({'_id': g.user['_id']})
    return jsonify({'success': True, 'user': serialize(user)})
