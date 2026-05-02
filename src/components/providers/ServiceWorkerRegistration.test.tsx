import { render, waitFor } from '@testing-library/react';

import { canRegisterServiceWorker, ServiceWorkerRegistration } from './ServiceWorkerRegistration';

const stubServiceWorker = (register = vi.fn(() => Promise.resolve({ scope: '/' }))) => {
  Object.defineProperty(globalThis.navigator, 'serviceWorker', {
    configurable: true,
    value: {
      register,
    },
  });

  return register;
};

describe('ServiceWorkerRegistration', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    stubServiceWorker();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    stubServiceWorker();
  });

  it('detects supported production service worker contexts', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(canRegisterServiceWorker()).toBe(true);

    vi.stubGlobal('location', { hostname: 'example.test', protocol: 'https:' });

    expect(canRegisterServiceWorker()).toBe(true);

    vi.stubGlobal('location', { hostname: '127.0.0.1', protocol: 'http:' });

    expect(canRegisterServiceWorker()).toBe(true);
  });

  it('rejects unsupported service worker contexts', () => {
    vi.stubEnv('NODE_ENV', 'production');

    vi.stubGlobal('window', undefined);

    expect(canRegisterServiceWorker()).toBe(false);

    vi.unstubAllGlobals();
    stubServiceWorker();
    Reflect.deleteProperty(globalThis.navigator, 'serviceWorker');

    expect(canRegisterServiceWorker()).toBe(false);

    stubServiceWorker();
    vi.stubGlobal('location', { hostname: 'example.test', protocol: 'http:' });

    expect(canRegisterServiceWorker()).toBe(false);
  });

  it('does not register the static service worker in test or development mode', async () => {
    render(<ServiceWorkerRegistration />);

    await waitFor(() => expect(navigator.serviceWorker.register).not.toHaveBeenCalled());
  });

  it('registers the static service worker in production mode', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    render(<ServiceWorkerRegistration />);

    await waitFor(() => expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js'));
  });

  it('ignores service worker registration failures', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const register = stubServiceWorker(vi.fn(() => Promise.reject(new Error('registration failed'))));

    render(<ServiceWorkerRegistration />);

    await waitFor(() => expect(register).toHaveBeenCalledWith('/sw.js'));
  });
});
