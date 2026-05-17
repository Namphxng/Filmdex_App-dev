import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { watchlistAPI, reviewsAPI, authAPI } from '../services/api';

const ALL_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'History', 'Horror',
  'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War',
];

export default function ProfileScreen() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [stats, setStats] = useState({ reviews: 0, watching: 0, watched: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchStats(); }, []);

  useFocusEffect(
    useCallback(() => {
      authAPI.getProfile().then(({ data }) => updateUser(data.user)).catch(() => {});
    }, [])
  );

  const fetchStats = async () => {
    try {
      const [watchedRes, watchingRes, reviewRes] = await Promise.all([
        watchlistAPI.get('watched'),
        watchlistAPI.get('watching'),
        reviewsAPI.getMine(),
      ]);
      setStats({
        watched: watchedRes.data.count || 0,
        watching: watchingRes.data.count || 0,
        reviews: reviewRes.data.total || 0,
      });
    } catch (error) {
      console.error('Profile stats error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setSelectedGenres(user?.favoriteGenres || []);
    setEditing(true);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ favoriteGenres: selectedGenres });
      updateUser(data.user);
      setEditing(false);
    } catch (e) {
      console.error('Save genres error:', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#f5c518" /></View>;
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
          { label: 'Reviews', value: stats.reviews },
          { label: 'Watching', value: stats.watching },
          { label: 'Watched', value: stats.watched },
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorite Genres</Text>
          {!editing && (
            <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <>
            <View style={styles.genresRow}>
              {ALL_GENRES.map(g => (
                <TouchableOpacity
                  key={g}
                  onPress={() => toggleGenre(g)}
                  style={[styles.genreChip, selectedGenres.includes(g) && styles.genreChipActive]}
                >
                  <Text style={[styles.genreText, selectedGenres.includes(g) && styles.genreTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.editActions}>
              <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditing(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.genresRow}>
            {(user?.favoriteGenres || []).length === 0 ? (
              <Text style={styles.emptyGenres}>No favorite genres set. Tap Edit to add some.</Text>
            ) : (
              user.favoriteGenres.map(g => (
                <View key={g} style={styles.genreChip}>
                  <Text style={styles.genreText}>{g}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>

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
    backgroundColor: '#f5c518', justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  avatarText: { color: '#000', fontSize: 36, fontWeight: 'bold' },
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
  editBtn: { borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4 },
  editBtnText: { color: '#aaa', fontSize: 13 },
  genresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genreChip: {
    backgroundColor: '#1a1a1a', paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#2a2a2a',
  },
  genreChipActive: { backgroundColor: '#f5c518', borderColor: '#f5c518' },
  genreText: { color: '#ccc', fontSize: 13 },
  genreTextActive: { color: '#000', fontWeight: 'bold' },
  emptyGenres: { color: '#555', fontSize: 14 },
  editActions: { flexDirection: 'row', gap: 8, marginTop: 16 },
  saveBtn: { flex: 1, backgroundColor: '#f5c518', borderRadius: 8, padding: 13, alignItems: 'center' },
  saveBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  cancelBtn: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 8, padding: 13, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  cancelBtnText: { color: '#aaa', fontSize: 14 },
  logoutBtn: {
    backgroundColor: '#1a1a1a', borderRadius: 8, padding: 15,
    alignItems: 'center', borderWidth: 1, borderColor: '#f5c518',
  },
  logoutText: { color: '#f5c518', fontWeight: 'bold', fontSize: 15 },
});
