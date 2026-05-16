import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  RefreshControl, ScrollView,
} from 'react-native';
import { moviesAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

export default function HomeScreen({ navigation }) {
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [trendingRes, recRes] = await Promise.all([
        moviesAPI.getTrending(),
        moviesAPI.getRecommendations(),
      ]);
      setTrending(trendingRes.data.data || []);
      setRecommended(recRes.data.data || []);
    } catch (error) {
      console.error('Home fetch error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const navigateToDetail = (item) => {
    navigation.navigate('MovieDetail', { tmdbId: item.tmdbId, tmdbType: item.tmdbType || 'movie' });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#E50914" />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.username} 👋</Text>
        <Text style={styles.subGreeting}>What are you watching today?</Text>
      </View>

      <Text style={styles.sectionTitle}>🔥 Trending This Week</Text>
      <FlatList
        data={trending.slice(0, 12)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `trend-${item.tmdbId}`}
        contentContainerStyle={styles.hList}
        renderItem={({ item }) => (
          <MovieCard item={item} onPress={() => navigateToDetail(item)} />
        )}
      />

      <Text style={styles.sectionTitle}>🎯 Recommended For You</Text>
      <FlatList
        data={recommended.slice(0, 12)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `rec-${item.tmdbId}`}
        contentContainerStyle={styles.hList}
        renderItem={({ item }) => (
          <MovieCard item={item} onPress={() => navigateToDetail(item)} />
        )}
      />

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  header: { padding: 20, paddingTop: 16 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subGreeting: { fontSize: 14, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  hList: { paddingHorizontal: 16, gap: 12 },
});
