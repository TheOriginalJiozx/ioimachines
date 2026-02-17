import React, { createContext, useContext, useEffect, useState } from 'react';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage?.getItem?.('adminToken') || window.ADMIN_TOKEN || null;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      const t = window.localStorage?.getItem?.('adminToken') || window.ADMIN_TOKEN || null;
      setAdminToken(t);
    };
    window.addEventListener('admin-auth-changed', handler);
    return () => window.removeEventListener('admin-auth-changed', handler);
  }, []);

  const setToken = (token) => {
    setAdminToken(token);
    if (typeof window !== 'undefined') {
      try {
        if (token) window.localStorage.setItem('adminToken', token);
        else window.localStorage.removeItem('adminToken');
      } catch (error) {}
      window.dispatchEvent(new Event('admin-auth-changed'));
    }
  };

  return (
    <AppStateContext.Provider value={{ adminToken, setToken }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
