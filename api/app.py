from datetime import datetime

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import init_mongo, init_firebase
from routes import auth as auth_routes
from routes import movies as movie_routes
from routes import watchlist as watchlist_routes
from routes import reviews as review_routes


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": Config.CLIENT_URL}}, supports_credentials=False)

    try:
        init_mongo()
        print(f'MongoDB connected: {Config.MONGODB_URI} / db={Config.MONGODB_DB}')
    except Exception as e:
        print(f'WARNING: MongoDB connection failed: {e}')
        print('Start MongoDB (mongod) then restart the API.')

    init_firebase()

    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(movie_routes.bp)
    app.register_blueprint(watchlist_routes.bp)
    app.register_blueprint(review_routes.bp)

    @app.get('/health')
    def health():
        return jsonify({'status': 'ok', 'timestamp': datetime.utcnow().isoformat()})

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({'success': False, 'message': 'Not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'success': False, 'message': f'Server error: {e}'}), 500

    return app


def start_ngrok():
    """Open a public ngrok tunnel to the local Flask port and return the URL."""
    from pyngrok import ngrok, conf
    if not Config.NGROK_AUTH_TOKEN:
        print('USE_NGROK=true but NGROK_AUTH_TOKEN is empty — skipping tunnel.')
        return None
    conf.get_default().auth_token = Config.NGROK_AUTH_TOKEN
    tunnel = ngrok.connect(Config.PORT, bind_tls=True)
    public_url = tunnel.public_url
    print('=' * 64)
    print(f'  PUBLIC URL:  {public_url}')
    print(f'  API base:    {public_url}/api')
    print(f'  Health:      {public_url}/health')
    print('=' * 64)
    print('Set your frontends to use this URL:')
    print(f'  web/.env       VITE_API_URL={public_url}/api')
    print(f'  mobile/.env    EXPO_PUBLIC_API_URL={public_url}/api')
    print('=' * 64)
    return public_url


if __name__ == '__main__':
    app = create_app()
    if Config.USE_NGROK:
        start_ngrok()
    print(f'Filmdex Flask API running on port {Config.PORT}')
    # use_reloader=False so ngrok's tunnel doesn't get torn down on file changes
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG, use_reloader=False)
