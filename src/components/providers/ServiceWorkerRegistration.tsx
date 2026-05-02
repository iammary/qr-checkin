'use client';

import { useEffect } from 'react';

export const canRegisterServiceWorker = () =>
  process.env.NODE_ENV === 'production' &&
  globalThis.window !== undefined &&
  'serviceWorker' in globalThis.navigator &&
  (globalThis.location.protocol === 'https:' || globalThis.location.hostname === 'localhost' || globalThis.location.hostname === '127.0.0.1');

export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (!canRegisterServiceWorker()) {
      return;
    }

    const register = async () => {
      try {
        await globalThis.navigator.serviceWorker.register('/sw.js');
      } catch {
        // Offline support is best-effort; the check-in flow still runs with saved facility data.
      }
    };

    void register();
  }, []);

  return null;
};
