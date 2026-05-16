import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { watchlistAPI, reviewsAPI } from '../services/api';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ watched: 0, planned: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [watchedRes, plannedRes, reviewRes] = await Promise.all([
        watchlistAPI.get('watched'),
        watchlistAPI.get('planned'),
        reviewsAPI.getMine(),
      ]);
      setStats({
        watched: watchedRes.data.count || 0,
        planned: plannedRes.data.count || 0,
        reviews: reviewRes.data.total || 0,
      });
    } catch (error) {
      console.error('Profile stats error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#E50914" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase()}</Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Watched', value: stats.watched },
          { label: 'Planned', value: stats.planned },
          { label: 'Reviews', value: stats.reviews },
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {user?.favoriteGenres?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Genres</Text>
          <View style={styles.genresRow}>
            {user.favoriteGenres.map(g => (
              <View key={g} style={styles.genreChip}>
                <Text style={styles.genreText}>{g}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  profileHeader: { alignItems: 'center', padding: 32, paddingTop: 52 },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#E50914', justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  username: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  bio: { fontSize: 14, color: '#aaa', marginTop: 10, textAlign: 'center', lineHeight: 20 },
  statsRow: {
    flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: '#1a1a1a', marginHorizontal: 16,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  section: { padding: 16, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#888', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  genresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genreChip: {
    backgroundColor: '#1a1a1a', paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#2a2a2a',
  },
  genreText: { color: '#ccc', fontSize: 13 },
  logoutBtn: {
    backgroundColor: '#1a1a1a', borderRadius: 8, padding: 15,
    alignItems: 'center', borderWidth: 1, borderColor: '#E50914',
  },
  logoutText: { color: '#E50914', fontWeight: 'bold', fontSize: 15 },
});
