import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, Clock, Eye, EyeOff } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const WishlistCard = ({ wishlist, user }) => {
  const { id, title, description, isPublic, createdAt, imageUrl, category } = wishlist
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const coverSrc = imageUrl?.startsWith('/') ? baseURL + imageUrl : imageUrl
  const avatarSrc = user?.avatarUrl?.startsWith('/') ? baseURL + user.avatarUrl : user?.avatarUrl

  const formattedDate = createdAt ? 
    formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR }) : 
    'Agora mesmo'

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card h-full"
    >
      <Link to={`/wishlist/${id}`} className="block h-full">
        <div className="relative aspect-video overflow-hidden">
          {coverSrc ? (
            <img 
              src={coverSrc} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Gift size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
            {isPublic ? (
              <Eye size={16} className="text-green-500" />
            ) : (
              <EyeOff size={16} className="text-red-500" />
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{title}</h3>
            {category && (
              <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 text-xs">
                {category}
              </span>
            )}
          </div>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
          
          <div className="mt-4 flex items-center justify-between">
            {user && (
              <div className="flex items-center">
                {avatarSrc ? (
                  <img 
                    src={avatarSrc} 
                    alt={user.name} 
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-300">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                  {user.name || 'Usuário'}
                </span>
              </div>
            )}
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default WishlistCard