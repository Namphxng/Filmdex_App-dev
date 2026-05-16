import os
from pymongo import MongoClient, ASCENDING
import firebase_admin
from firebase_admin import credentials

from config import Config

_client = None
_db = None


def init_mongo():
    global _client, _db
    _client = MongoClient(Config.MONGODB_URI, serverSelectionTimeoutMS=5000)
    _client.admin.command('ping')
    _db = _client[Config.MONGODB_DB]

    _db.users.create_index([('firebaseUid', ASCENDING)], unique=True)
    _db.users.create_index([('email', ASCENDING)], unique=True)
    _db.users.create_index([('username', ASCENDING)], unique=True)
    _db.watchlists.create_index(
        [('userId', ASCENDING), ('tmdbId', ASCENDING)], unique=True
    )
    _db.watchlists.create_index([('userId', ASCENDING), ('status', ASCENDING)])
    _db.reviews.create_index(
        [('userId', ASCENDING), ('tmdbId', ASCENDING)], unique=True
    )
    _db.reviews.create_index([('tmdbId', ASCENDING)])
    return _db


def get_db():
    if _db is None:
        init_mongo()
    return _db


def init_firebase():
    if firebase_admin._apps:
        return
    cred_path = Config.FIREBASE_SERVICE_ACCOUNT
    if not os.path.exists(cred_path):
        print(
            f'WARNING: Firebase service account not found at "{cred_path}". '
            'Auth endpoints will return 401 until you add it.'
        )
        return
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    print('Firebase Admin initialized.')
