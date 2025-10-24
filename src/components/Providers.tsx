'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { initializeAuth } from '@/store/slices/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state from localStorage on client side
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
