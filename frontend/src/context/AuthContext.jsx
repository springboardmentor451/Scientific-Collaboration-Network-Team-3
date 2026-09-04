import React, { createContext, useState, useEffect } from 'react';
import { clearOtpPending } from '../utils/otpSession';

export const AuthContext = createContext(null);

/**
 * Normalise the payload returned by /auth/verify-otp.
 * Real API: { access_token, token_type, user: { id, username, email, role, is_active } }
 * Mock:     { access_token, token_type, user: { ... } }
 */
function normalizeSession(payload) {
  if (!payload) return null;

  const token =
    payload.access_token || payload.token || payload.user?.token;

  // Support both nested user object and flat payload
  const user = payload.user || null;

  if (!token || !user) return null;

  // Ensure we always have a `name` field for display purposes
  const normalizedUser = {
    ...user,
    name: user.name || user.username || user.email || 'User',
  };

  return { user: normalizedUser, token };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('scna_user');
    const storedToken = localStorage.getItem('scna_token');

    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        // Ensure legacy stored users always have a name field
        setUser({ ...parsed, name: parsed.name || parsed.username || parsed.email || 'User' });
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
        localStorage.removeItem('scna_user');
        localStorage.removeItem('scna_token');
      }
    }
    setIsLoading(false);
  }, []);

  const completeLogin = (payload) => {
    const session = normalizeSession(payload);
    if (!session) return false;
    setUser(session.user);
    setToken(session.token);
    localStorage.setItem('scna_user', JSON.stringify(session.user));
    localStorage.setItem('scna_token', session.token);
    clearOtpPending();
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('scna_user');
    localStorage.removeItem('scna_token');
    clearOtpPending();
  };

  return (
    <AuthContext.Provider
      value={{ user, role: user?.role, token, completeLogin, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
