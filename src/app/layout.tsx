
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MaliTrack - Small Business Management',
  description: 'Bookkeeping, inventory, and local networking for small businesses.',
  manifest: '/manifest.json', // Link to the manifest file
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MaliTrack',
    // startupImage: [], // You can add startup images for iOS
  },
};

export const viewport: Viewport = {
  themeColor: '#7A9D96', // Corresponds to theme_color in manifest
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans transition-colors duration-300`}>
        <AuthProvider> {/* Wrap children with AuthProvider */}
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
