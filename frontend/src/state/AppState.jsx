import PropTypes from 'prop-types';
AppStateProvider.propTypes = {
  children: PropTypes.node
};

import React, { useEffect, useState } from 'react';
import { AppStateContext } from './AppStateContext.js';

export function AppStateProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => {
    if (typeof window === 'undefined') return null;
        return globalThis.localStorage.getItem('adminToken') || globalThis.ADMIN_TOKEN || null;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
        const t = globalThis.localStorage?.getItem?.('adminToken') || globalThis.ADMIN_TOKEN || null;
      setAdminToken(t);
    };
      globalThis.addEventListener('admin-auth-changed', handler);
      return () => globalThis.removeEventListener('admin-auth-changed', handler);
  }, []);

  const setToken = (token) => {
    setAdminToken(token);
    if (typeof window !== 'undefined') {
        try {
            if (token) globalThis.localStorage.setItem("adminToken", token);
            else globalThis.localStorage.removeItem("adminToken");
      } catch (error) {
        console.error("Failed to update admin token in localStorage", error);
      }
        globalThis.dispatchEvent(new Event('admin-auth-changed'));
    }
  };

  return (
    <AppStateContext.Provider value={{ adminToken, setToken }}>
      {children}
    </AppStateContext.Provider>
  );
}
