import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { moviesAPI } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await moviesAPI.search(query.trim());
      setResults(res.data.results || []);
    } catch (error) {
      console.error('Search error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search movies & series..."
          placeholderTextColor="#555"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 48 }} />
      )}

      {!loading && hasSearched && results.length === 0 && (
        <Text style={styles.noResults}>No results for "{query}"</Text>
      )}

      {!loading && !hasSearched && (
        <Text style={styles.hint}>Search for any movie or TV series</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => `s-${item.tmdbId}`}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            onPress={() => navigation.navigate('MovieDetail', { tmdbId: item.tmdbId, tmdbType: item.tmdbType || 'movie' })}
            style={styles.gridCard}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  searchBar: { flexDirection: 'row', padding: 16, gap: 8 },
  input: {
    flex: 1, backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 8,
    padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#2a2a2a',
  },
  searchBtn: {
    backgroundColor: '#E50914', borderRadius: 8,
    paddingHorizontal: 18, justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  noResults: { color: '#666', textAlign: 'center', marginTop: 48, fontSize: 15 },
  hint: { color: '#444', textAlign: 'center', marginTop: 48, fontSize: 14 },
  grid: { padding: 8 },
  row: { justifyContent: 'space-between' },
  gridCard: { width: '48%', marginBottom: 12 },
});
