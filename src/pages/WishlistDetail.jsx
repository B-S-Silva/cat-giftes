import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWishlistById } from '../services/wishlists';
import { addItem as addItemApi, deleteItem as deleteItemApi, reserveItem, unreserveItem } from '../services/items';
import ItemCard from '../components/ItemCard';

const WishlistDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);

  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('must');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWishlistById(id);
        if (!mounted) return;
        setWishlist(data);
        setItems(data.items || []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        if (err.response?.status === 404) setError('Lista não encontrada.');
        else if (err.response?.status === 403) setError('Você não tem acesso a esta lista.');
        else setError('Falha ao carregar a lista.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    } catch {
      alert('Não foi possível copiar o link.');
    }
  };

  const isOwner = !!user && !!wishlist && user.id === wishlist.userId;

  const addItem = async (e) => {
    e.preventDefault();
    if (!isOwner) {
      alert('Você não é dono desta lista.');
      return;
    }
    try {
      const newItem = await addItemApi(id, {
        name,
        link: link || undefined,
        price: price ? Number(price) : undefined,
        description: description || undefined,
        priority,
        imageFile,
      });
      setItems((prev) => [newItem, ...prev]);
      setName('');
      setLink('');
      setPrice('');
      setImageFile(null);
      setDescription('');
      setPriority('must');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Falha ao adicionar item');
    }
  };

  const removeItem = async (itemId) => {
    if (!isOwner) return;
    try {
      await deleteItemApi(itemId);
      setItems((prev) => prev.filter((it) => it.id !== itemId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Falha ao remover item');
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <p className="text-gray-600 dark:text-gray-300">Carregando lista...</p>
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

  if (!wishlist) {
    return <div className="py-8 text-gray-600 dark:text-gray-300">Lista não encontrada.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{wishlist.title}</h2>
        <button onClick={copyLink} className="btn btn-secondary">Copiar link</button>
      </div>
      {wishlist.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-6">{wishlist.description}</p>
      )}

      {isOwner && (
        <form onSubmit={addItem} className="card p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adicionar item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Nome" className="rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="Link" className="rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={link} onChange={(e) => setLink(e.target.value)} />
            <input placeholder="Preço" type="number" step="0.01" className="rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" />
            <textarea placeholder="Descrição" className="md:col-span-2 rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prioridade</label>
              <select className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="must">Quero muito</option>
                <option value="nice">Seria legal</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary">Adicionar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id}>
            <ItemCard item={item} />
            <div className="mt-2 flex justify-between items-center">
              {!isOwner && (
                <div>
                  {item.isReserved ? (
                    <button className="btn btn-secondary btn-sm" onClick={async () => {
                      try {
                        const updated = await unreserveItem(item.id)
                        setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)))
                        alert('Reserva removida. Obrigado!')
                      } catch (err) {
                        console.error(err)
                        alert(err.response?.data?.message || 'Falha ao remover reserva')
                      }
                    }}>Remover reserva</button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={async () => {
                      try {
                        const updated = await reserveItem(item.id)
                        setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)))
                        alert('Item reservado anonimamente! 🎁')
                      } catch (err) {
                        console.error(err)
                        alert(err.response?.data?.message || 'Falha ao reservar')
                      }
                    }}>Reservar anonimamente</button>
                  )}
                </div>
              )}
              {isOwner && (
                <div className="flex justify-end">
                  <button className="btn btn-secondary btn-sm" onClick={() => removeItem(item.id)}>Remover</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-gray-600 dark:text-gray-300">Nenhum item ainda.</div>}
      </div>
    </div>
  );
};

export default WishlistDetail;