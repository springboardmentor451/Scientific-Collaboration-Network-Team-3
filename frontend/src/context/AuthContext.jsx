import React, { createContext, useState, useEffect } from 'react';
import { mockUsers } from '../mocks/users';
import { clearOtpPending } from '../utils/otpSession';

export const AuthContext = createContext(null);

function normalizeSession(payload) {
  if (!payload) return null;
  const token = payload.access_token || payload.token || payload.user?.token;
  const user = payload.user || payload;
  if (!token || !user) return null;
  return { user, token };
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
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
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

  const login = (role) => {
    const mockUser = mockUsers[role];
    if (!mockUser) return false;
    return completeLogin({ user: mockUser, access_token: mockUser.token });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('scna_user');
    localStorage.removeItem('scna_token');
    clearOtpPending();
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role, token, login, completeLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
