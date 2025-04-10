// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Header';
import { AuthProvider } from '@/components/auth/AuthProvider';
import QueryProvider from '@/components/QueryProvider';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';  // 분리된 ThemeProvider 컴포넌트

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HairSalon - Salon Management Platform',
  description: 'A platform for salon owners to manage advertisements and displays',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <Navbar />
              <div className="min-h-screen flex flex-col">
                <Toaster />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}