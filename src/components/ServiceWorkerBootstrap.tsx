'use client';

import { useEffect } from 'react';

export default function ServiceWorkerBootstrap() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let reloading = false;

    const activateWaiting = (registration: ServiceWorkerRegistration) => {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed') worker.postMessage({ type: 'SKIP_WAITING' });
      });
    };

    const onControllerChange = () => {
      if (reloading || window.location.pathname !== '/lab') return;
      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((registration) => {
      activateWaiting(registration);
      registration.addEventListener('updatefound', () => activateWaiting(registration));
      registration.update().catch(() => {});
    }).catch(() => {});

    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  return null;
}
