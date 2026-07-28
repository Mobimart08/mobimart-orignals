import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService, userService } from '../api/services';
import { setAccessToken, getAccessToken } from '../api/client';

const AuthContext = createContext();
const AUTH_BROADCAST_CHANNEL = 'mobimart-auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const channelRef = useRef(null);

  const restoreSession = useCallback(async () => {
    // 1. Explicitly request a refresh token on startup to securely load the session
    // from the HttpOnly 7-day persistent cookie.
    try {
      const refreshResponse = await authService.refresh();
      const newAccessToken = refreshResponse.data.data.accessToken;
      setAccessToken(newAccessToken);

      // 2. Fetch the user profile with the securely loaded access token.
      const profileResponse = await userService.getProfile({ silent: true });
      setUser(profileResponse.data.data);
      return profileResponse.data.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const broadcastAuthEvent = useCallback((type) => {
    try {
      channelRef.current?.postMessage({ type, ts: Date.now() });
    } catch (_) {
      // ignore broadcast failures
    }

    try {
      window.localStorage.setItem('mobimart:auth:event', JSON.stringify({ type, ts: Date.now() }));
      window.localStorage.removeItem('mobimart:auth:event');
    } catch (_) {
      // ignore storage broadcast failures
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const profile = await restoreSession();
        if (!cancelled) {
          setUser(profile);
        }
      } catch {
        setAccessToken(null);
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [restoreSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
      broadcastAuthEvent('session-ended');
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (!isAdminRoute) {
        setAuthModalOpen(true);
      } else {
        window.location.href = '/admin/login';
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [broadcastAuthEvent]);

  useEffect(() => {
    const handleAuthEvent = async (event) => {
      const type = event?.data?.type || (() => {
        try {
          return JSON.parse(event.newValue || '{}').type;
        } catch {
          return null;
        }
      })();

      if (type === 'session-updated') {
        try {
          const profile = await restoreSession();
          setUser(profile);
        } catch {
          setAccessToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }

      if (type === 'session-ended') {
        setAccessToken(null);
        setUser(null);
        setLoading(false);
      }
    };

    if (typeof BroadcastChannel !== 'undefined') {
      channelRef.current = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
      channelRef.current.onmessage = handleAuthEvent;
    }

    const handleStorage = (event) => {
      if (event.key === 'mobimart:auth:event') {
        handleAuthEvent(event);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, [restoreSession]);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    const { accessToken, user } = res.data.data;
    setAccessToken(accessToken);
    setUser(user);
    setAuthModalOpen(false);
    broadcastAuthEvent('session-updated');
    return user;
  }, [broadcastAuthEvent]);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    const { accessToken, user } = res.data.data;
    setAccessToken(accessToken);
    setUser(user);
    setAuthModalOpen(false);
    broadcastAuthEvent('session-updated');
    return user;
  }, [broadcastAuthEvent]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      setAccessToken(null);
      setUser(null);
      broadcastAuthEvent('session-ended');
    }
  }, [broadcastAuthEvent]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authModalOpen, setAuthModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
