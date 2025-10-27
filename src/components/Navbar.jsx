import { Link } from 'react-router-dom';
import { Menu, Search, Gift, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { user: currentUser, logout } = useAuth();
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const avatarSrc = currentUser?.avatarUrl?.startsWith('/') ? baseURL + currentUser.avatarUrl : currentUser?.avatarUrl;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Menu e Logo */}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center ml-3">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="text-purple-600 mr-2"
              >
                <Gift size={24} />
              </motion.div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Cat Giftes</span>
            </Link>
          </div>
          
          {/* Barra de pesquisa */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Buscar listas de presentes..." 
              />
            </div>
          </div>
          
          {/* Perfil do usuário */}
          {currentUser ? (
            <div className="flex items-center">
              <Link to="/profile" className="flex items-center">
                {avatarSrc ? (
                  <img 
                    src={avatarSrc} 
                    alt="Perfil" 
                    className="h-8 w-8 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <User size={16} className="text-purple-600 dark:text-purple-300" />
                  </div>
                )}
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                  {currentUser.name || 'Usuário'}
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="btn btn-secondary text-sm">
                Entrar
              </Link>
              <Link to="/register" className="btn btn-primary text-sm">
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;