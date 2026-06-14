import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Whenever token in state changes, make sure localstorage matches
    if (token) {
      localStorage.setItem('token', token);
      
      // Fetch user info
      client.get('/api/user')
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          
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
      const res = await client.post('/api/login', { email, password });
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
        await client.post('/api/logout');
      }
    } catch (err) {
      
    } finally {
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {!loading ? children : <div className="h-screen flex items-center justify-center">Loading...</div>}
    </AuthContext.Provider>
  );
};
