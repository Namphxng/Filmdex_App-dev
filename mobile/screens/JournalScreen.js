import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { reviewsAPI } from '../services/api';
import ReviewCard from '../components/ReviewCard';

export default function JournalScreen() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => { fetchReviews(); }, [])
  );

  const fetchReviews = async () => {
    try {
      const res = await reviewsAPI.getMine();
      setReviews(res.data.data || []);
    } catch (error) {
      console.error('Journal error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await reviewsAPI.delete(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error('Delete review error:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Movie Journal</Text>
      <Text style={styles.subHeader}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</Text>
      <FlatList
        data={reviews}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchReviews(); }}
            tintColor="#E50914"
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No reviews yet.{'\n'}Find a movie and write your first review!
          </Text>
        }
        renderItem={({ item }) => (
          <ReviewCard review={item} onDelete={() => handleDelete(item._id)} showTitle />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#fff', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 4 },
  subHeader: { color: '#666', fontSize: 13, paddingHorizontal: 16, marginBottom: 4 },
  list: { padding: 16, gap: 12 },
  empty: { color: '#555', textAlign: 'center', marginTop: 64, fontSize: 15, lineHeight: 26 },
});
