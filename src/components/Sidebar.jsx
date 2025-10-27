import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Gift, User, Compass, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, isMobile, closeSidebar }) => {
  const { currentUser } = useAuth();

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }
  };

  const overlayVariants = {
    open: { opacity: 0.5, display: 'block' },
    closed: { opacity: 0, display: 'none', transition: { delay: 0.2 } }
  };

  const menuItems = [
    { icon: <Home size={20} />, text: 'Início', path: '/home' },
    { icon: <Gift size={20} />, text: 'Minhas Listas', path: '/my-wishlists' },
    { icon: <Compass size={20} />, text: 'Descobrir', path: '/home' },
    { icon: <User size={20} />, text: 'Perfil', path: '/profile' },
  ];

  return (
    <>
      {/* Overlay para dispositivos móveis */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black z-20"
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`bg-white dark:bg-gray-800 w-64 fixed top-16 bottom-0 left-0 z-30 overflow-y-auto transition-all duration-300 shadow-md ${
          !isOpen && !isMobile ? 'w-0' : ''
        }`}
      >
        {isMobile && (
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        )}

        {currentUser && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Perfil"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <User size={20} className="text-purple-600 dark:text-purple-300" />
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.displayName || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;