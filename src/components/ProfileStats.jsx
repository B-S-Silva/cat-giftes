import { motion } from 'framer-motion';
import { ChartBarIcon, GiftIcon, ListBulletIcon, HeartIcon, ClockIcon, StarIcon, SparklesIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const ProfileStats = ({ user, wishlists = [], reservedGifts = [], receivedGifts = [], givenGifts = [], customDates = [] }) => {
  // Calcular estatísticas reais
  const totalGifts = wishlists.reduce((sum, list) => sum + (list.items?.length || 0), 0);
  const totalLikes = wishlists.reduce((sum, list) => sum + (list.likes || 0), 0);
  const totalValue = wishlists.reduce((sum, list) => {
    return sum + (list.items?.reduce((itemSum, item) => itemSum + (item.price || 0), 0) || 0);
  }, 0);

  const statCards = [
    {
      title: 'Listas Criadas',
      value: wishlists.length,
      icon: ListBulletIcon,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Presentes Adicionados',
      value: totalGifts,
      icon: GiftIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Curtidas Recebidas',
      value: totalLikes,
      icon: HeartIcon,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      title: 'Datas Especiais',
      value: customDates.length,
      icon: ChartBarIcon,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={`${stat.id}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          <div className="relative p-6">
            {/* Icon */}
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Content */}
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{stat.title}</p>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent dark:from-gray-800 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileStats;