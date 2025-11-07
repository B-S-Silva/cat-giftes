import { motion } from 'framer-motion';
import { HeartIcon, GiftIcon, CalendarIcon, EyeIcon } from '@heroicons/react/24/outline';

const WishlistProfileCard = ({ wishlist, index }) => {
  const totalValue = wishlist.items?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;
  const completedItems = wishlist.items?.filter(item => item.reserved).length || 0;
  const progress = wishlist.items?.length > 0 ? (completedItems / wishlist.items.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
              {wishlist.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {wishlist.description || 'Lista de desejos especial'}
            </p>
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <GiftIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{wishlist.items?.length || 0}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Itens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedItems}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Reservados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">R$ {totalValue.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Valor Total</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </div>

        {/* Items preview */}
        {wishlist.items && wishlist.items.length > 0 && (
          <div className="mb-4">
            <div className="flex -space-x-2">
              {wishlist.items.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                >
                  {item.name?.charAt(0).toUpperCase() || '?'}
                </div>
              ))}
              {wishlist.items.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  +{wishlist.items.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4" />
              <span>{wishlist.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>{wishlist.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{new Date(wishlist.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
          >
            Ver Lista
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WishlistProfileCard;