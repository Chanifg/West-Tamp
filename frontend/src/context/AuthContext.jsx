import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Set up Axios Interceptor once
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers['Accept'] = 'application/json';
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Whenever token in state changes, make sure localstorage matches
    if (token) {
      localStorage.setItem('token', token);
      
      // Fetch user info
      axios.get('http://localhost:8000/api/user')
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error("Token invalid", err);
          handleLogout(); // local logout without API call
        })
        .finally(() => setLoading(false));
    } else {
      localStorage.removeItem('token');
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:8000/api/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:8000/api/logout');
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {!loading ? children : <div className="h-screen flex items-center justify-center">Loading...</div>}
    </AuthContext.Provider>
  );
};
