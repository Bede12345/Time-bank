import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('✅ Token found in localStorage');
      fetchProfile();
    } else {
      console.log('⚠️ No token found, skipping profile fetch');
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('📡 Fetching profile...');
      const response = await api.get('/auth/me');
      console.log('✅ Profile fetched:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('📡 Logging in...');
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      console.log('✅ Login successful');
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set state
      setUser(user);
      
      // Set default auth header for future requests
      api.defaults.headers.common['Authorization'] = Bearer ;
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📡 Registering...');
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      console.log('✅ Registration successful');
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set state
      setUser(user);
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = Bearer ;
      
      return { success: true };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.log('👋 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
