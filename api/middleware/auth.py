from functools import wraps
from datetime import datetime, timezone

from flask import request, jsonify, g
from firebase_admin import auth as fb_auth

from extensions import get_db


def verify_firebase_token():
    """Return (decoded_token, error_message). Either token or error is None."""
    header = request.headers.get('Authorization', '')
    if not header.startswith('Bearer '):
        return None, 'Missing or invalid Authorization header'
    token = header.split(' ', 1)[1].strip()
    if not token:
        return None, 'Empty token'
    try:
        return fb_auth.verify_id_token(token), None
    except Exception as e:
        return None, f'Invalid token: {e}'


def _ensure_user(decoded):
    """Find the Mongo user for a Firebase uid, auto-creating a minimal one if missing."""
    db = get_db()
    uid = decoded['uid']
    email = decoded.get('email', '') or ''
    user = db.users.find_one({'firebaseUid': uid})
    if user:
        return user
    now = datetime.now(timezone.utc)
    base = (email.split('@')[0] if email else 'user').lower()
    username = f"{base}_{uid[:6]}"
    doc = {
        'firebaseUid': uid,
        'email': email.lower(),
        'username': username,
        'avatar': '',
        'bio': '',
        'favoriteGenres': [],
        'followers': [],
        'following': [],
        'createdAt': now,
        'updatedAt': now,
    }
    db.users.insert_one(doc)
    return doc


def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        decoded, err = verify_firebase_token()
        if err:
            return jsonify({'success': False, 'message': err}), 401
        g.firebase = decoded
        g.user = _ensure_user(decoded)
        return f(*args, **kwargs)
    return wrapper
