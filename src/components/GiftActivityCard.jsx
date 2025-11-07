import { motion } from 'framer-motion';
import { GiftIcon, HeartIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

const GiftActivityCard = ({ gift, type, index }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'reserved':
        return {
          title: 'Presentes Reservados',
          icon: GiftIcon,
          color: 'blue',
          gradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
          borderColor: 'border-blue-200 dark:border-blue-700'
        };
      case 'received':
        return {
          title: 'Presentes Recebidos',
          icon: HeartIcon,
          color: 'pink',
          gradient: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
          borderColor: 'border-pink-200 dark:border-pink-700'
        };
      case 'given':
        return {
          title: 'Presentes Dados',
          icon: StarIcon,
          color: 'purple',
          gradient: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
          borderColor: 'border-purple-200 dark:border-purple-700'
        };
      default:
        return {
          title: 'Atividade',
          icon: ClockIcon,
          color: 'gray',
          gradient: 'from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${config.borderColor}`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center border ${config.borderColor}`}>
            <IconComponent className={`w-6 h-6 text-${config.color}-600`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">{gift.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{config.title}</p>
          </div>
        </div>

        {/* Gift details */}
        <div className="space-y-3 mb-4">
          {gift.price && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Valor:</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">R$ {gift.price.toLocaleString('pt-BR')}</span>
            </div>
          )}
          
          {gift.reservedBy && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Reservado por:</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">{gift.reservedBy}</span>
            </div>
          )}

          {gift.category && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Categoria:</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                {gift.category}
              </span>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            type === 'reserved' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
            type === 'received' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' :
            type === 'given' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              type === 'reserved' ? 'bg-blue-500' :
              type === 'received' ? 'bg-pink-500' :
              type === 'given' ? 'bg-purple-500' :
              'bg-gray-500'
            }`}></div>
            {type === 'reserved' ? 'Reservado' :
             type === 'received' ? 'Recebido' :
             type === 'given' ? 'Presenteado' :
             'Pendente'}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
          <ClockIcon className="w-4 h-4" />
          <span>{new Date(gift.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GiftActivityCard;