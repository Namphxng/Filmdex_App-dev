import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  const isRegistering = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && !isRegistering.current) {
        try {
          const { data } = await api.get('/auth/profile');
          setUser(data.user);
          localStorage.setItem('filmdex_user', JSON.stringify(data.user));
        } catch (e) {
          setUser(null);
          localStorage.removeItem('filmdex_user');
        }
      } else if (!fbUser) {
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
    isRegistering.current = true;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const { data } = await api.post('/auth/register', { username, favoriteGenres });
      setUser(data.user);
      localStorage.setItem('filmdex_user', JSON.stringify(data.user));
    } catch (ex) {
      await signOut(auth);
      throw ex;
    } finally {
      isRegistering.current = false;
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('filmdex_user');
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem('filmdex_user', JSON.stringify(updatedUser));
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
