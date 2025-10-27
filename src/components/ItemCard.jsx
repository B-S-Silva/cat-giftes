import { motion } from 'framer-motion'

const ItemCard = ({ item }) => {
  const { name, link, price, imageUrl, description } = item
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const imgSrc = imageUrl?.startsWith('/') ? baseURL + imageUrl : imageUrl
  return (
    <motion.div whileHover={{ y: -4 }} className="card">
      <div className="aspect-video overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
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
      </div>
    </motion.div>
  )
}

export default ItemCard