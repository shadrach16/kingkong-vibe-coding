import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);
      const userData = response.user; // Ensure you're using `response.data.user`
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(response));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.signup(email, password);
      const userData = response.user; // Ensure you're using `response.data.user`
      // setUser(userData);
      // localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Derive the isLoggedIn status
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);