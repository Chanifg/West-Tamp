import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set default axios header
  useEffect(() => {
    axios.defaults.headers.common['Accept'] = 'application/json';
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // Optionally fetch user info to confirm token is valid
      axios.get('http://localhost:8000/api/user')
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error("Token invalid", err);
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      delete axios.defaults.headers.common['Authorization'];
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

  const logout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:8000/api/logout');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {!loading ? children : <div className="h-screen flex items-center justify-center">Loading...</div>}
    </AuthContext.Provider>
  );
};
