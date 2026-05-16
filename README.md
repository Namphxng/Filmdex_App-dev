# Filmdex — Movie & Series Watchlist

A personal movie tracking and journaling app built for the 2190512 Application Development course.

**Stack:** Flask (Python) · Firebase Authentication · MongoDB · React (web) · React Native/Expo (mobile)

---

## Project Structure

```
filmdex/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── .env.example
│
└── mobile/
    ├── components/
    ├── context/
    ├── navigation/
    ├── screens/
    ├── services/
    └── App.js
```

---

## Prerequisites

- Node.js 18+
- MongoDB (local install or MongoDB Atlas free tier)
- TMDB API Key — free at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- Expo CLI: `npm install -g expo-cli`

---

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` and fill in:
```
MONGODB_URI=mongodb://localhost:27017/filmdex
JWT_SECRET=any_long_random_string
TMDB_API_KEY=your_tmdb_api_key
```

Start the server:
```bash
npm run dev        # development (nodemon)
npm start          # production
```

API runs at: `http://localhost:5000`
Health check: `http://localhost:5000/health`

---

## Mobile Setup

```bash
cd mobile
npm install
```

Create `mobile/.env`:
```
# Android emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

# iOS simulator
# EXPO_PUBLIC_API_URL=http://localhost:5000/api

# Physical device (use your PC's local IP)
# EXPO_PUBLIC_API_URL=http://192.168.1.xxx:5000/api
```

Start Expo:
```bash
npx expo start
```

Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/profile | ✓ | Get own profile |
| PUT | /api/auth/profile | ✓ | Update profile |

### Movies
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/movies/trending | — | Trending this week |
| GET | /api/movies/search?q= | — | Search by title |
| GET | /api/movies/:id?type= | — | Movie/series details |
| GET | /api/movies/recommendations | ✓ | Genre-based picks |
| GET | /api/movies/genres | — | Genre list |

### Watchlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/watchlist?status= | ✓ | Get watchlist |
| POST | /api/watchlist | ✓ | Add to watchlist |
| PUT | /api/watchlist/:id | ✓ | Update status |
| DELETE | /api/watchlist/:id | ✓ | Remove item |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/reviews/:movieId | — | Movie reviews |
| GET | /api/reviews/my | ✓ | My journal |
| POST | /api/reviews | ✓ | Write review |
| PUT | /api/reviews/:id | ✓ | Edit review |
| DELETE | /api/reviews/:id | ✓ | Delete review |

---

## Features

- **User Management** — Register, login, JWT auth, profile with avatar/bio/genres
- **Movie Discovery** — Trending, search, genre browsing via TMDB
- **Watchlist** — Plan/Watching/Watched status tracking
- **Movie Journal** — Write reviews, rate 1-10, view history
- **Recommendations** — Genre-based, pulls from TMDB

---

## Grading Criteria Checklist

- [x] Backend database (MongoDB + Mongoose)
- [x] REST API (Node.js/Express)
- [x] Frontend mobile (React Native/Expo) — 8 screens
- [x] At least 3 pages/screens excluding auth
- [x] TMDB API integration with caching
- [x] JWT authentication
- [x] Input validation & error handling
- [x] Rate limiting (100 req/15min)
