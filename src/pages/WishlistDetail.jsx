import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, query, where, collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import UploadButton from '../components/UploadButton';
import ItemCard from '../components/ItemCard';

const WishlistDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);

  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    (async () => {
      const wDoc = await getDoc(doc(db, 'wishlists', id));
      if (wDoc.exists()) {
        setWishlist({ id: wDoc.id, ...wDoc.data() });
      } else {
        setWishlist(null);
      }
    })();
  }, [id]);

  useEffect(() => {
    const q = query(collection(db, 'items'), where('wishlistId', '==', id));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, [id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    } catch {
      alert('Não foi possível copiar o link.');
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!currentUser || !wishlist || currentUser.uid !== wishlist.userId) return;
    await addDoc(collection(db, 'items'), {
      wishlistId: id,
      name,
      link: link || null,
      price: price ? Number(price) : null,
      imageURL: imageURL || null,
      description: description || null,
      createdAt: serverTimestamp(),
    });
    setName('');
    setLink('');
    setPrice('');
    setImageURL('');
    setDescription('');
  };

  if (!wishlist) {
    return <div className="py-8 text-gray-600 dark:text-gray-300">Lista não encontrada.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{wishlist.title}</h2>
        <button onClick={copyLink} className="btn btn-secondary">Copiar link</button>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{wishlist.description}</p>

      {currentUser && currentUser.uid === wishlist.userId && (
        <form onSubmit={addItem} className="card p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adicionar item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Nome" className="rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="Link" className="rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={link} onChange={(e) => setLink(e.target.value)} />
            <input placeholder="Preço" type="number" step="0.01" className="rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={price} onChange={(e) => setPrice(e.target.value)} />
            <UploadButton onUpload={setImageURL} pathPrefix={`items/${currentUser?.uid || 'anon'}`} label="Enviar imagem" />
            <textarea placeholder="Descrição" className="md:col-span-2 rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary">Adicionar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
        {items.length === 0 && <div className="text-gray-600 dark:text-gray-300">Nenhum item ainda.</div>}
      </div>
    </div>
  );
};

export default WishlistDetail;