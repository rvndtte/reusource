'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('reusource_token') : null));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reusource_token');
    }
    setToken(null);
    setUser(null);
  }, []);

  // Restore authenticated session on mount
  useEffect(() => {
    async function restoreSession() {
      if (token) {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setIsLoading(false);
    }
    restoreSession();
  }, [token, logout]);

  const saveTokenAndUser = async (authToken, initialUserData = null) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reusource_token', authToken);
    }
    setToken(authToken);
    try {
      const profile = await authApi.getMe();
      setUser(profile);
    } catch {
      if (initialUserData) {
        setUser(initialUserData);
      }
    }
  };

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
    return updated;
  };

  const value = {
    user,
    setUser,
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
