import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Shield } from './shield';

export const metadata: Metadata = {
  title: 'FindIP Shield + Next.js App Router',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 420, margin: '48px auto', padding: '0 16px' }}>
        {/* Rendered once for the whole app, so Shield starts on every page. */}
        <Shield />
        {children}
      </body>
    </html>
  );
}
