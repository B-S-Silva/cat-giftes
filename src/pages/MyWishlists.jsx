import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import WishlistCard from '../components/WishlistCard';
import { getMyWishlists, createWishlist } from '../services/wishlists';

const MyWishlists = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [eventDate, setEventDate] = useState('');
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMyWishlists();
        if (!mounted) return;
        setWishlists(data);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError('Falha ao carregar suas listas.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const w = await createWishlist({ title, description, isPublic, eventDate: eventDate || undefined });
      setWishlists((prev) => [w, ...prev]);
      setTitle('');
      setDescription('');
      setIsPublic(true);
      setEventDate('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha ao criar a lista.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Minhas Listas</h2>

      <form onSubmit={handleCreate} className="card p-4 mb-6">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data do evento</label>
            <input type="datetime-local" className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
            <textarea className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Criando...' : 'Criar lista'}</button>
          {error && <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>}
        </div>
      </form>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Carregando suas listas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((w) => (
            <div key={w.id} className="relative">
              <WishlistCard wishlist={w} user={w.user} />
            </div>
          ))}
          {wishlists.length === 0 && <div className="text-gray-600 dark:text-gray-300">Você ainda não tem listas.</div>}
        </div>
      )}
    </div>
  );
};

export default MyWishlists;