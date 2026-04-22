import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to admin
  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-6 font-body-md">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(27,67,50,0.12)] p-8 border border-surface-variant">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container mb-4">
             <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Admin Login</h1>
          <p className="text-on-surface-variant text-sm">Westtamp Wellness - Desa Tampirkulon</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-label-md text-on-surface mb-2">Email</label>
            <input 
              type="email" 
              className="w-full border border-outline-variant p-3 rounded-lg bg-surface-bright focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@westtamp.com"
            />
          </div>
          <div>
            <label className="block text-sm font-label-md text-on-surface mb-2">Password</label>
            <input 
              type="password" 
              className="w-full border border-outline-variant p-3 rounded-lg bg-surface-bright focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-label-md font-bold mt-2 hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-surface-variant text-center">
            <a href="/" className="text-sm text-primary hover:underline font-medium">
                &larr; Back to Public Site
            </a>
        </div>
      </div>
    </div>
  );
}
