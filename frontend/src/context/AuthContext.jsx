import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService, userService } from '../api/services';
import { setAccessToken, getAccessToken } from '../api/client';

const AuthContext = createContext();
const AUTH_BROADCAST_CHANNEL = 'mobimart-auth';

let globalRestorePromise = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingBuyNow, setPendingBuyNow] = useState(null);
  const channelRef = useRef(null);
  const navigateRef = useRef(null);

  const restoreSession = useCallback(async () => {
    // 1. Prevent React 18 Strict Mode double-invocation race conditions across mounts
    if (globalRestorePromise) {
      return globalRestorePromise;
    }

    globalRestorePromise = (async () => {
      try {
        // 2. Explicitly request a refresh token on startup BEFORE any other API calls
        const refreshResponse = await authService.refresh();
        const newAccessToken = refreshResponse.data.data.accessToken;
        
        // 3. Store the new access token securely in memory
        setAccessToken(newAccessToken);

        // 4. Fetch the user profile using the new access token
        const profileResponse = await userService.getProfile({ silent: true });
        
        // 5. Restore the authenticated user
        setUser(profileResponse.data.data);
        return profileResponse.data.data;
      } catch (error) {
        throw error;
      } finally {
        // 6. Clear the lock
        globalRestorePromise = null;
      }
    })();

    return globalRestorePromise;
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

    // Auto-resume pending Buy Now action after successful login
    setPendingBuyNow(prev => {
      if (prev && navigateRef.current) {
        setTimeout(() => navigateRef.current('/checkout/buy-now', { state: prev }), 0);
      }
      return null;
    });

    return user;
  }, [broadcastAuthEvent]);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    const { accessToken, user } = res.data.data;
    setAccessToken(accessToken);
    setUser(user);
    setAuthModalOpen(false);
    broadcastAuthEvent('session-updated');

    // Auto-resume pending Buy Now action after successful registration
    setPendingBuyNow(prev => {
      if (prev && navigateRef.current) {
        setTimeout(() => navigateRef.current('/checkout/buy-now', { state: prev }), 0);
      }
      return null;
    });

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
    <AuthContext.Provider value={{ user, loading, login, register, logout, authModalOpen, setAuthModalOpen, pendingBuyNow, setPendingBuyNow, navigateRef }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
