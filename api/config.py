import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    PORT = int(os.environ.get('PORT', 5000))
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017')
    MONGODB_DB = os.environ.get('MONGODB_DB', 'filmdex')
    FIREBASE_SERVICE_ACCOUNT = os.environ.get(
        'FIREBASE_SERVICE_ACCOUNT', 'firebase-service-account.json'
    )
    CLIENT_URL = os.environ.get('CLIENT_URL', '*')
    DEBUG = os.environ.get('FLASK_ENV', 'development') == 'development'

    USE_NGROK = os.environ.get('USE_NGROK', 'false').lower() == 'true'
    NGROK_AUTH_TOKEN = os.environ.get('NGROK_AUTH_TOKEN', '')
