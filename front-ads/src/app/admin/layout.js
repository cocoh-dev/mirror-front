// admin layout.js (서버 컴포넌트로 유지)
import AdminLayout from '@/components/admin/AdminLayout';
import QueryProvider from '@/components/QueryProvider';

export const metadata = {
  title: 'Admin Dashboard - HairSalon',
  description: 'HairSalon Admin Dashboard',
};

export default function AdminRootLayout({ children }) {
  return (
    <AdminLayout>
      <QueryProvider>
        {children}
      </QueryProvider>
    </AdminLayout>
  );
}