import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import WishlistCard from '../components/WishlistCard';

const Home = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'wishlists'), where('isPublic', '==', true), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        let user = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          user = userDoc.exists() ? userDoc.data() : null;
        } catch {}
        list.push({ id: docSnap.id, ...data, user });
      }
      setWishlists(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <p className="text-gray-600 dark:text-gray-300">Carregando feed...</p>
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