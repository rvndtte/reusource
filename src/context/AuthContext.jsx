'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('reusource_token') : null));
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('reusource_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reusource_token');
      localStorage.removeItem('reusource_user');
    }
    setToken(null);
    setUser(null);
  }, []);

  const saveTokenAndUser = async (authToken, userData = null) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reusource_token', authToken);
    }
    setToken(authToken);

    let activeUser = userData;
    try {
      const profile = await authApi.getMe();
      if (profile && profile.user_id) {
        activeUser = profile;
      }
    } catch {
      // Keep using userData if network or cold start happens
    }

    if (activeUser) {
      setUser(activeUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('reusource_user', JSON.stringify(activeUser));
      }
    }
  };

  // Sync session in background on mount
  useEffect(() => {
    async function syncSession() {
      if (token) {
        try {
          const profile = await authApi.getMe();
          if (profile && profile.user_id) {
            setUser(profile);
            if (typeof window !== 'undefined') {
              localStorage.setItem('reusource_user', JSON.stringify(profile));
            }
          }
        } catch (err) {
          console.warn('Background session sync notice:', err);
        }
      }
    }
    syncSession();
  }, [token]);

  const loginWithEmail = async (email, password) => {
    const res = await authApi.loginEmail(email, password);
    await saveTokenAndUser(res.access_token, res);
    return res;
  };

  const loginWithOtp = async (phone, otpCode) => {
    const res = await authApi.verifyOtpLogin({ phone, otp_code: otpCode });
    await saveTokenAndUser(res.access_token, res);
    return res;
  };

  const registerWithOtp = async (payload) => {
    const res = await authApi.verifyOtpRegister(payload);
    await saveTokenAndUser(res.access_token, res);
    return res;
  };

  const registerWithEmail = async (payload) => {
    const res = await authApi.registerEmail(payload);
    await saveTokenAndUser(res.access_token, res);
    return res;
  };

  // Determine user's portal role
  const role = user?.role || null;
  const isSupplier = role === 'supplier_admin' || role === 'supplier';
  const isBuyer = role === 'buyer_admin' || role === 'buyer';
  const isAdmin = role === 'admin' || role === 'verifier';

  const updateUserProfile = async (payload) => {
    const updated = await authApi.updateProfile(payload);
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reusource_user', JSON.stringify(updated));
    }
    return updated;
  };

  const value = {
    user,
    setUser: (u) => {
      setUser(u);
      if (typeof window !== 'undefined') {
        if (u) localStorage.setItem('reusource_user', JSON.stringify(u));
        else localStorage.removeItem('reusource_user');
      }
    },
    token,
    role,
    isSupplier,
    isBuyer,
    isAdmin,
    isAuthenticated: !!token && !!user,
    isLoading,
    loginWithEmail,
    loginWithOtp,
    registerWithOtp,
    registerWithEmail,
    updateUserProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
