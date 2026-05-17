import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller',
];

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password, selectedGenres);
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input} placeholder="Username" placeholderTextColor="#666"
          value={username} onChangeText={setUsername} autoCapitalize="none"
        />
        <TextInput
          style={styles.input} placeholder="Email" placeholderTextColor="#666"
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
        />
        <TextInput
          style={styles.input} placeholder="Password (min 6 characters)" placeholderTextColor="#666"
          value={password} onChangeText={setPassword} secureTextEntry
        />

        <Text style={styles.sectionLabel}>Favorite Genres <Text style={styles.optional}>(optional)</Text></Text>
        <View style={styles.genresContainer}>
          {GENRES.map(genre => (
            <TouchableOpacity
              key={genre}
              style={[styles.genreChip, selectedGenres.includes(genre) && styles.genreChipActive]}
              onPress={() => toggleGenre(genre)}
            >
              <Text style={[styles.genreText, selectedGenres.includes(genre) && styles.genreTextActive]}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkHighlight}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  inner: { padding: 24, paddingTop: 64 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 32 },
  input: {
    backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 8,
    padding: 16, marginBottom: 14, fontSize: 15, borderWidth: 1, borderColor: '#2a2a2a',
  },
  sectionLabel: { color: '#aaa', fontSize: 14, marginBottom: 12, marginTop: 6 },
  optional: { color: '#555', fontSize: 12 },
  genresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  genreChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: '#333', backgroundColor: '#111',
  },
  genreChipActive: { backgroundColor: '#f5c518', borderColor: '#f5c518' },
  genreText: { color: '#666', fontSize: 13 },
  genreTextActive: { color: '#fff', fontWeight: '600' },
  button: {
    backgroundColor: '#f5c518', borderRadius: 8, padding: 16,
    alignItems: 'center', marginBottom: 24,
  },
  buttonText: { color: '#000', fontSize: 15, fontWeight: 'bold', letterSpacing: 2 },
  link: { color: '#666', textAlign: 'center', fontSize: 14 },
  linkHighlight: { color: '#f5c518', fontWeight: '600' },
});
