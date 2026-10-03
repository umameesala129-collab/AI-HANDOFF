import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('aih_token');
      if (!token) {
        setLoading(false);
        return;
      }

      if (token === 'demo_token_smartclinic_guest') {
        setUser({
          id: 'demo_user_divya',
          name: 'M. Durga (Demo PM)',
          email: 'demo@aihandoff.com',
          role: 'Project Manager'
        });
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/profile');
        if (res.data?.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to restore session:', err.message);
        localStorage.removeItem('aih_token');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        localStorage.setItem('aih_token', res.data.data.token);
        setUser(res.data.data.user);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      if (res.data?.success) {
        localStorage.setItem('aih_token', res.data.data.token);
        setUser(res.data.data.user);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      };
    }
  };

  const loginAsDemo = async () => {
    const demoUser = {
      id: 'demo_user_divya',
      name: 'M. Durga (Demo PM)',
      email: 'demo@aihandoff.com',
      role: 'Project Manager'
    };
    localStorage.setItem('aih_token', 'demo_token_smartclinic_guest');
    setUser(demoUser);

    // Call backend to ensure demo project is seeded
    try {
      await api.post('/projects/demo');
    } catch (err) {
      console.log('Demo seed notice:', err.message);
    }
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('aih_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
