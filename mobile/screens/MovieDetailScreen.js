import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, TextInput, Modal,
} from 'react-native';
import { moviesAPI, watchlistAPI, reviewsAPI } from '../services/api';

const STATUS_OPTIONS = ['planned', 'watching', 'watched'];
const STATUS_LABELS = { planned: 'Plan to Watch', watching: 'Watching', watched: 'Watched' };

export default function MovieDetailScreen({ route }) {
  const { tmdbId, tmdbType = 'movie' } = route.params;
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [watchlistItem, setWatchlistItem] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [movieRes, reviewsRes, wlRes] = await Promise.all([
        moviesAPI.getById(tmdbId, tmdbType),
        reviewsAPI.getByMovie(tmdbId, tmdbType),
        watchlistAPI.get(),
      ]);
      setMovie(movieRes.data.data);
      setReviews(reviewsRes.data.data || []);
      setAvgRating(reviewsRes.data.averageRating || 0);
      const found = wlRes.data.data?.find(i => String(i.tmdbId) === String(tmdbId));
      setWatchlistItem(found || null);
    } catch (error) {
      console.error('Movie detail error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = async (status) => {
    try {
      if (watchlistItem) {
        await watchlistAPI.update(watchlistItem._id, status);
        setWatchlistItem(prev => ({ ...prev, status }));
      } else {
        const res = await watchlistAPI.add({
          tmdbId, tmdbType, title: movie.title, poster: movie.poster, status,
        });
        setWatchlistItem(res.data.data);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleSubmitReview = async () => {
    const ratingNum = parseInt(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 10) {
      Alert.alert('Error', 'Please enter a rating between 1 and 10');
      return;
    }
    try {
      await reviewsAPI.create({ tmdbId, tmdbType, title: movie.title, rating: ratingNum, reviewText });
      setShowReviewModal(false);
      setRating('');
      setReviewText('');
      const res = await reviewsAPI.getByMovie(tmdbId, tmdbType);
      setReviews(res.data.data || []);
      setAvgRating(res.data.averageRating || 0);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Could not submit review');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f5c518" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.backdrop ? (
        <Image source={{ uri: movie.backdrop }} style={styles.backdrop} resizeMode="cover" />
      ) : (
        <View style={styles.backdropPlaceholder} />
      )}

      <View style={styles.content}>
        <View style={styles.posterRow}>
          <Image
            source={{ uri: movie.poster || 'https://via.placeholder.com/100x150/1a1a1a/555?text=?' }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.meta}>{movie.releaseYear} · {movie.type === 'series' ? 'TV Series' : 'Movie'}</Text>
            <Text style={styles.meta}>⭐ TMDB {movie.rating}/10</Text>
            {avgRating > 0 && <Text style={styles.meta}>🎬 User Avg {avgRating}/10</Text>}
            {movie.runtime && <Text style={styles.meta}>⏱ {movie.runtime} min</Text>}
            <View style={styles.genres}>
              {movie.genres?.slice(0, 3).map(g => (
                <View key={g} style={styles.genreChip}>
                  <Text style={styles.genreText}>{g}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.overview}>{movie.overview}</Text>

        <Text style={styles.sectionTitle}>Watchlist</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.statusBtn, watchlistItem?.status === s && styles.statusBtnActive]}
              onPress={() => handleWatchlistToggle(s)}
            >
              <Text style={[styles.statusBtnText, watchlistItem?.status === s && styles.statusBtnTextActive]}>
                {STATUS_LABELS[s]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.reviewBtn} onPress={() => setShowReviewModal(true)}>
          <Text style={styles.reviewBtnText}>Write a Review</Text>
        </TouchableOpacity>

        {movie.cast?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Cast</Text>
            <View style={styles.castRow}>
              {movie.cast.map((c, i) => (
                <View key={i} style={styles.castCard}>
                  <Text style={styles.castName} numberOfLines={2}>{c.name}</Text>
                  <Text style={styles.castChar} numberOfLines={1}>{c.character}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
        {reviews.length === 0 && (
          <Text style={styles.noContent}>No reviews yet. Be the first!</Text>
        )}
        {reviews.map(r => (
          <View key={r._id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewUser}>{r.userId?.username || 'User'}</Text>
              <Text style={styles.reviewRating}>⭐ {r.rating}/10</Text>
            </View>
            {r.reviewText ? <Text style={styles.reviewText}>{r.reviewText}</Text> : null}
            <Text style={styles.reviewDate}>
              {new Date(r.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>

      <Modal visible={showReviewModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Review: {movie.title}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Rating (1–10)"
              placeholderTextColor="#555"
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Your thoughts... (optional)"
              placeholderTextColor="#555"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.reviewBtn} onPress={handleSubmitReview}>
              <Text style={styles.reviewBtnText}>Submit Review</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowReviewModal(false)} style={{ marginTop: 12 }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  errorText: { color: '#666', fontSize: 16 },
  backdrop: { width: '100%', height: 220 },
  backdropPlaceholder: { height: 180, backgroundColor: '#1a1a1a' },
  content: { padding: 16 },
  posterRow: { flexDirection: 'row', gap: 14, marginTop: -50 },
  poster: { width: 100, height: 148, borderRadius: 8, borderWidth: 2, borderColor: '#2a2a2a' },
  titleBlock: { flex: 1, paddingTop: 56 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  meta: { color: '#888', fontSize: 13, marginTop: 3 },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 },
  genreChip: { backgroundColor: '#1a1a1a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1, borderColor: '#2a2a2a' },
  genreText: { color: '#888', fontSize: 11 },
  overview: { color: '#bbb', fontSize: 14, lineHeight: 22, marginTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 24, marginBottom: 12 },
  statusRow: { flexDirection: 'row', gap: 6 },
  statusBtn: { flex: 1, paddingVertical: 9, borderRadius: 6, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  statusBtnActive: { backgroundColor: '#f5c518', borderColor: '#f5c518' },
  statusBtnText: { color: '#555', fontSize: 11, fontWeight: '500' },
  statusBtnTextActive: { color: '#000', fontWeight: '700' },
  reviewBtn: { backgroundColor: '#f5c518', borderRadius: 8, padding: 13, alignItems: 'center', marginTop: 12 },
  reviewBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  castRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  castCard: { backgroundColor: '#1a1a1a', borderRadius: 8, padding: 10, minWidth: 110 },
  castName: { color: '#fff', fontSize: 13, fontWeight: '600' },
  castChar: { color: '#666', fontSize: 11, marginTop: 2 },
  noContent: { color: '#555', fontSize: 14, marginBottom: 8 },
  reviewCard: { backgroundColor: '#1a1a1a', borderRadius: 8, padding: 12, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewUser: { color: '#f5c518', fontWeight: 'bold', fontSize: 14 },
  reviewRating: { color: '#f9c84a', fontWeight: 'bold' },
  reviewText: { color: '#ccc', fontSize: 13, lineHeight: 20, marginBottom: 4 },
  reviewDate: { color: '#555', fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 16 },
  modalInput: {
    backgroundColor: '#2a2a2a', color: '#fff', borderRadius: 8,
    padding: 13, marginBottom: 12, fontSize: 15, borderWidth: 1, borderColor: '#333',
  },
  cancelText: { color: '#666', textAlign: 'center', fontSize: 14 },
});
