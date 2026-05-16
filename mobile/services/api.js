import axios from 'axios';
import { auth } from './firebase';

// Android emulator: 10.0.2.2 | iOS simulator: localhost | Physical device: your machine's LAN IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => Promise.reject(error)
);

export const moviesAPI = {
  getTrending: () => api.get('/movies/trending'),
  search: (q, page = 1) => api.get('/movies/search', { params: { q, page } }),
  getById: (id, type = 'movie') => api.get(`/movies/${id}`, { params: { type } }),
  getRecommendations: () => api.get('/movies/recommendations'),
  getGenres: (type = 'movie') => api.get('/movies/genres', { params: { type } }),
  getByGenre: (genreId, type = 'movie', page = 1) => api.get(`/movies/genre/${genreId}`, { params: { type, page } }),
};

export const watchlistAPI = {
  get: (status) => api.get('/watchlist', { params: status ? { status } : {} }),
  add: (data) => api.post('/watchlist', data),
  update: (id, status) => api.put(`/watchlist/${id}`, { status }),
  remove: (id) => api.delete(`/watchlist/${id}`),
};

export const reviewsAPI = {
  getByMovie: (movieId, type = 'movie', page = 1) => api.get(`/reviews/${movieId}`, { params: { type, page } }),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  getMine: (page = 1) => api.get('/reviews/my', { params: { page } }),
};


export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default api;
