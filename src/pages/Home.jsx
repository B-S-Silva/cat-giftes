import { useEffect, useState } from 'react';
import WishlistCard from '../components/WishlistCard';
import { getPublicWishlists } from '../services/wishlists';

const Home = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPublicWishlists();
        if (!mounted) return;
        setWishlists(data);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError('Falha ao carregar o feed público.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <p className="text-gray-600 dark:text-gray-300">Carregando feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Descobrir Wishlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlists.map((w) => (
          <WishlistCard key={w.id} wishlist={w} user={w.user} />
        ))}
        {wishlists.length === 0 && (
          <div className="text-gray-600 dark:text-gray-300">Nenhuma wishlist pública por enquanto.</div>
        )}
      </div>
    </div>
  );
};

export default Home;