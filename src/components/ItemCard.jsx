import { motion } from 'framer-motion'
import { Lock, Flame, Sparkles } from 'lucide-react'

const ItemCard = ({ item }) => {
  const { name, link, price, imageUrl, description, isReserved, priority } = item
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const imgSrc = imageUrl?.startsWith('/') ? baseURL + imageUrl : imageUrl
  return (
    <motion.div whileHover={{ y: -4 }} className="card">
      <div className="relative aspect-video overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
        )}
        {isReserved && (
          <div className="absolute top-2 left-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-full px-2 py-1 text-xs inline-flex items-center gap-1">
            <Lock size={12} /> Reservado
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{name}</h4>
        {description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{price ? `R$ ${Number(price).toFixed(2)}` : 'Preço não informado'}</span>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-xs">Ver mais</a>
          )}
        </div>
        {priority && (
          <div className="mt-2">
            {priority === 'must' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200 px-2 py-1 text-xs">
                <Flame size={12} /> Quero muito
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 text-xs">
                <Sparkles size={12} /> Seria legal
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ItemCard