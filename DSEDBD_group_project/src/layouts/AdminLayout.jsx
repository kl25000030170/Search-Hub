import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar, { AdminMobileHeader } from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <AdminMobileHeader onMenuOpen={() => setMobileOpen(true)} />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
