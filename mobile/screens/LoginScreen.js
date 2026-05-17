import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>FILMDEX</Text>
        <Text style={styles.subtitle}>MOVIE & SERIES WATCHLIST</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>LOGIN</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>
            Don't have an account? <Text style={styles.linkHighlight}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 52, fontWeight: 'bold', color: '#f5c518', textAlign: 'center', letterSpacing: 6 },
  subtitle: { fontSize: 12, color: '#555', textAlign: 'center', letterSpacing: 3, marginBottom: 52 },
  input: {
    backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 8,
    padding: 16, marginBottom: 14, fontSize: 15, borderWidth: 1, borderColor: '#2a2a2a',
  },
  button: {
    backgroundColor: '#f5c518', borderRadius: 8, padding: 16,
    alignItems: 'center', marginTop: 6, marginBottom: 28,
  },
  buttonText: { color: '#000', fontSize: 15, fontWeight: 'bold', letterSpacing: 2 },
  link: { color: '#666', textAlign: 'center', fontSize: 14 },
  linkHighlight: { color: '#f5c518', fontWeight: '600' },
});
