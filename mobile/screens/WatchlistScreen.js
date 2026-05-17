import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { watchlistAPI } from '../services/api';
import WatchlistItem from '../components/WatchlistItem';

const TABS = [
  { key: 'planned', label: 'Planned' },
  { key: 'watching', label: 'Watching' },
  { key: 'watched', label: 'Watched' },
];

export default function WatchlistScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('planned');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchWatchlist();
    }, [activeTab])
  );

  const fetchWatchlist = async () => {
    try {
      const status = activeTab;
      const res = await watchlistAPI.get(status);
      setItems(res.data.data || []);
    } catch (error) {
      console.error('Watchlist error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await watchlistAPI.remove(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      console.error('Remove error:', error.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await watchlistAPI.update(id, status);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      console.error('Status error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f5c518" style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchWatchlist(); }}
              tintColor="#f5c518"
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {`No ${activeTab} items.`}
            </Text>
          }
          renderItem={({ item }) => (
            <WatchlistItem
              item={item}
              onPress={() => navigation.navigate('MovieDetail', { tmdbId: item.tmdbId, tmdbType: item.tmdbType || 'movie' })}
              onRemove={() => handleRemove(item._id)}
              onStatusChange={(status) => handleStatusChange(item._id, status)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  tabs: { flexDirection: 'row', backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#f5c518' },
  tabText: { color: '#555', fontSize: 13, fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  list: { padding: 16, gap: 10 },
  empty: { color: '#555', textAlign: 'center', marginTop: 64, fontSize: 15 },
});
