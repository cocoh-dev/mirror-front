// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import { AuthProvider } from '@/components/auth/AuthProvider';
import QueryProvider from '@/components/QueryProvider';

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
            <main>{children}</main>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}