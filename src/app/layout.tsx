import type { Metadata, Viewport } from 'next';

import { ServiceWorkerRegistration } from '@/components/providers/ServiceWorkerRegistration';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Facility Check-In',
  description: 'A static PWA for validating gym facility check-ins by QR code or manual facility ID.',
  manifest: '/manifest.webmanifest',
  icons: {
    apple: '/icons/apple-touch-icon.png',
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { sizes: '192x192', type: 'image/png', url: '/icons/icon-192.png' },
      { sizes: '512x512', type: 'image/png', url: '/icons/icon-512.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Check-In',
  },
};

export const viewport: Viewport = {
  themeColor: '#176b4d',
  width: 'device-width',
  initialScale: 1,
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en">
    <body>
      <ServiceWorkerRegistration />
      {children}
    </body>
  </html>
);

export default RootLayout;
