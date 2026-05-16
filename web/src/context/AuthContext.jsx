import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase.js';
import api from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const { data } = await api.get('/auth/profile');
          setUser(data.user);
          localStorage.setItem('filmdex_user', JSON.stringify(data.user));
        } catch (e) {
          setUser(null);
          localStorage.removeItem('filmdex_user');
        }
      } else {
        setUser(null);
        localStorage.removeItem('filmdex_user');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
    const { data } = await api.get('/auth/profile');
    setUser(data.user);
    localStorage.setItem('filmdex_user', JSON.stringify(data.user));
  }

  async function register(username, email, password, favoriteGenres = []) {
    await createUserWithEmailAndPassword(auth, email, password);
    try {
      const { data } = await api.post('/auth/register', { username, favoriteGenres });
      setUser(data.user);
      localStorage.setItem('filmdex_user', JSON.stringify(data.user));
    } catch (ex) {
      await signOut(auth);
      throw ex;
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('filmdex_user');
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
