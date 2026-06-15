import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import MobileDrawer from '../components/layout/MobileDrawer';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMobileMenuOpen={() => setMobileOpen(true)} />
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
