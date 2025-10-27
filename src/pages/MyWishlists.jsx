import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import UploadButton from '../components/UploadButton';
import WishlistCard from '../components/WishlistCard';

const MyWishlists = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [imageURL, setImageURL] = useState('');
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'wishlists'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data(), user: { name: currentUser.displayName, photoURL: currentUser.photoURL } }));
      setWishlists(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const createWishlist = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addDoc(collection(db, 'wishlists'), {
      userId: currentUser.uid,
      title,
      description,
      isPublic,
      imageURL: imageURL || null,
      createdAt: serverTimestamp(),
    });
    setTitle('');
    setDescription('');
    setIsPublic(true);
    setImageURL('');
  };

  const deleteWishlist = async (id) => {
    await deleteDoc(doc(db, 'wishlists', id));
  };

  const toggleVisibility = async (w) => {
    await updateDoc(doc(db, 'wishlists', w.id), { isPublic: !w.isPublic });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Minhas Listas</h2>

      <form onSubmit={createWishlist} className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
            <input className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Visibilidade</label>
            <select className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={isPublic ? 'public' : 'private'} onChange={(e) => setIsPublic(e.target.value === 'public')}>
              <option value="public">Pública</option>
              <option value="private">Privada</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
            <textarea className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagem da lista (opcional)</label>
            <UploadButton onUpload={setImageURL} pathPrefix={`wishlists/${currentUser?.uid || 'anon'}`} label="Enviar thumbnail" />
            {imageURL && <img src={imageURL} alt="Thumbnail" className="mt-2 h-24 rounded-md object-cover" />}
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className="btn btn-primary">Criar lista</button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Carregando suas listas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((w) => (
            <div key={w.id} className="relative">
              <WishlistCard wishlist={w} user={w.user} />
              <div className="absolute top-2 left-2 flex gap-2">
                <button onClick={() => toggleVisibility(w)} className="btn btn-secondary text-xs">{w.isPublic ? 'Tornar privada' : 'Tornar pública'}</button>
                <button onClick={() => deleteWishlist(w.id)} className="btn btn-secondary text-xs">Excluir</button>
              </div>
            </div>
          ))}
          {wishlists.length === 0 && <div className="text-gray-600 dark:text-gray-300">Você ainda não tem listas.</div>}
        </div>
      )}
    </div>
  );
};

export default MyWishlists;