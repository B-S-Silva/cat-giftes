import { Link } from 'react-router-dom';
import { Home, List, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user: currentUser, logout } = useAuth();

  return (
    <aside className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-white dark:bg-gray-900 w-64 shadow-lg z-20`}>
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="text-2xl font-bold text-purple-600">Cat Giftes</Link>
      </div>
      <nav className="p-4 space-y-2">
        <Link to="/" className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <Home className="mr-3" size={18} />
          <span>Início</span>
        </Link>
        <Link to="/my-wishlists" className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <List className="mr-3" size={18} />
          <span>Minhas listas</span>
        </Link>
        {currentUser && (
          <Link to="/profile" className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt="Perfil" 
                className="h-6 w-6 rounded-full object-cover mr-3"
              />
            ) : (
              <User className="mr-3" size={18} />
            )}
            <span>{currentUser.name || 'Meu perfil'}</span>
          </Link>
        )}
        {currentUser ? (
          <button onClick={logout} className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left">
            <LogOut className="mr-3" size={18} />
            <span>Sair</span>
          </button>
        ) : (
          <div className="space-y-2">
            <Link to="/login" className="block p-2 rounded bg-purple-600 text-white text-center">Entrar</Link>
            <Link to="/register" className="block p-2 rounded border border-purple-600 text-purple-600 text-center">Cadastrar</Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;