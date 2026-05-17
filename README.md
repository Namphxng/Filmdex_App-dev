# Filmdex — Movie & Series Watchlist

A personal movie tracking and journaling app built for the 2190512 Application Development course.

**Stack:** Flask (Python) · Firebase Authentication · MongoDB · React + Vite (web) · React Native/Expo (mobile)

---

## Project Structure

```
filmdex/
├── api/                        # Flask REST API (Python)
│   ├── routes/                 # auth, movies, watchlist, reviews
│   ├── services/               # movies_data.py (mock dataset + TMDB)
│   ├── middleware/             # Firebase token verification
│   ├── app.py                  # Flask app entry point
│   ├── config.py               # MongoDB + Firebase config
│   └── requirements.txt
│
├── web/                        # React + Vite frontend
│   └── src/
│       ├── pages/              # Home, Search, MovieDetail, Watchlist, Profile, Journal, Login, Register
│       ├── components/         # Header
│       ├── context/            # AuthContext (Firebase)
│       └── api.js              # Axios instance
│
└── mobile/                     # React Native + Expo (SDK 54)
    ├── screens/                # HomeScreen, SearchScreen, MovieDetailScreen,
    │                           # WatchlistScreen, JournalScreen, ProfileScreen,
    │                           # LoginScreen, RegisterScreen
    ├── components/             # MovieCard, WatchlistItem, ReviewCard
    ├── context/                # AuthContext (Firebase)
    ├── navigation/             # AppNavigator (tab + stack)
    └── services/               # api.js (Axios instance)
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas free tier)
- Firebase project with Email/Password authentication enabled
- Expo Go app on your phone (for mobile)

---

## API Setup

```bash
cd api
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `api/.env`:
```
MONGO_URI=mongodb://localhost:27017/filmdex
FIREBASE_CREDENTIALS=firebase-service-account.json
```

Start the server:
```bash
python app.py
```

API runs at: `http://localhost:5000`

---

## Web Setup

```bash
cd web
npm install
```

Create `web/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the dev server:
```bash
npm run dev
```

---

## Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

Create `mobile/.env`:
```
EXPO_PUBLIC_API_URL=http://<your-local-ip>:5000/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Scan the QR code with Expo Go on your phone.

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| GET | /api/auth/profile | ✓ | Get own profile |
| PUT | /api/auth/profile | ✓ | Update profile (favorite genres, bio) |

### Movies
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/movies/trending | — | Trending movies & series |
| GET | /api/movies/search?q= | — | Search by title |
| GET | /api/movies/:id?type= | — | Movie/series details with cast |
| GET | /api/movies/recommendations | ✓ | Genre-based recommendations |

### Watchlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/watchlist?status= | ✓ | Get watchlist (filter by status) |
| POST | /api/watchlist | ✓ | Add to watchlist |
| PUT | /api/watchlist/:id | ✓ | Update status |
| DELETE | /api/watchlist/:id | ✓ | Remove item |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/reviews/:movieId?type= | — | Reviews for a movie |
| GET | /api/reviews/my | ✓ | My reviews (journal) |
| POST | /api/reviews | ✓ | Write a review |
| DELETE | /api/reviews/:id | ✓ | Delete a review |

---

## Features

- **Authentication** — Register/login via Firebase, profile with avatar, bio, and favorite genres
- **Movie Discovery** — Trending titles, search, movie/series detail with cast
- **Watchlist** — Track titles as Planned, Watching, or Watched (with watch date)
- **Journal** — Write and rate reviews (1–10), view per-movie average rating
- **Recommendations** — Genre-based suggestions personalised to your favorite genres
- **Cross-platform** — Web and mobile share the same backend and user data

---

## Grading Criteria Checklist

- [x] Backend database (MongoDB + PyMongo)
- [x] REST API (Flask/Python)
- [x] Firebase Authentication (email/password)
- [x] Frontend web (React + Vite) — 8 pages
- [x] Frontend mobile (React Native/Expo) — 8 screens
- [x] At least 3 pages/screens excluding auth
- [x] TMDB-backed movie dataset with cast data
- [x] Input validation & error handling
- [x] Genre-based recommendation system
