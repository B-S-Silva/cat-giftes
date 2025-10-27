import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Verificar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} closeSidebar={() => setIsSidebarOpen(false)} />
        
        <main className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
          <div className="container-app py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;