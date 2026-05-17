import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import api, { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRegistering = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && !isRegistering.current) {
        try {
          const { data } = await authAPI.getProfile();
          setUser(data.user);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
        } catch (e) {
          setUser(null);
          await AsyncStorage.removeItem('user');
        }
      } else if (!fbUser) {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    const { data } = await authAPI.getProfile();
    setUser(data.user);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (username, email, password, favoriteGenres = []) => {
    isRegistering.current = true;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const { data } = await authAPI.register({ username, favoriteGenres });
      setUser(data.user);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (ex) {
      await signOut(auth);
      throw ex;
    } finally {
      isRegistering.current = false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const updateUser = async (updatedUser) => {
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, userToken: firebaseUser, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
