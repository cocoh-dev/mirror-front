// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import { AuthProvider } from '@/components/auth/AuthProvider';
import QueryProvider from '@/components/QueryProvider';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HairSalon - Salon Management Platform',
  description: 'A platform for salon owners to manage advertisements and displays',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}