import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function MovieCard({ item, onPress, style }) {
  const isTV = item.tmdbType === 'tv' || item.type === 'series';
  const [imgError, setImgError] = useState(false);

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
      {item.poster && !imgError ? (
        <Image
          source={{ uri: item.poster }}
          style={styles.poster}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={styles.posterFallback}>
          <Text style={styles.posterFallbackText}>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.metaRow}>
          {item.releaseYear ? <Text style={styles.year}>{item.releaseYear}</Text> : null}
          {item.rating > 0 ? <Text style={styles.rating}>⭐ {item.rating}</Text> : null}
        </View>
        <View style={[styles.typeBadge, isTV && styles.tvBadge]}>
          <Text style={styles.typeText}>{isTV ? 'Series' : 'Movie'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 130, backgroundColor: '#1a1a1a', borderRadius: 8, overflow: 'hidden' },
  poster: { width: '100%', height: 185, backgroundColor: '#2a2a2a' },
  posterFallback: {
    width: '100%', height: 185, backgroundColor: '#2a2a2a',
    justifyContent: 'center', alignItems: 'center', padding: 8,
  },
  posterFallbackText: { color: '#555', fontSize: 12, textAlign: 'center' },
  info: { padding: 8 },
  title: { color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 4, lineHeight: 17 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  year: { color: '#666', fontSize: 11 },
  rating: { color: '#f9c84a', fontSize: 11 },
  typeBadge: {
    backgroundColor: '#E50914', borderRadius: 3,
    paddingHorizontal: 5, paddingVertical: 2, alignSelf: 'flex-start',
  },
  tvBadge: { backgroundColor: '#1565C0' },
  typeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
});
