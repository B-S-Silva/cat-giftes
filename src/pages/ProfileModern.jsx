import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UploadButton from '../components/UploadButton';
import CalendarPicker from '../components/CalendarPicker';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import DeviceMockup from '../components/DeviceMockup';
import WishlistProfileCard from '../components/WishlistProfileCard';
import GiftActivityCard from '../components/GiftActivityCard';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { customDatesService } from '../services/customDates';
import { 
  HomeIcon, 
  GiftIcon, 
  CalendarDaysIcon, 
  Cog6ToothIcon,
  ChartBarIcon,
  HeartIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ProfileModern = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [customDates, setCustomDates] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [reservedGifts, setReservedGifts] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [givenGifts, setGivenGifts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const avatarSrc = avatarUrl?.startsWith('/') ? baseURL + avatarUrl : avatarUrl;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, avatarUrl });
      alert('Perfil atualizado! ✨');
    } catch (err) {
      console.error(err);
      alert('Falha ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleAddDate = async (date, name) => {
    try {
      await customDatesService.createCustomDate(date, name);
      await loadCustomDates();
      alert('Data adicionada com sucesso! 📅');
    } catch (err) {
      console.error('Erro ao adicionar data:', err);
      alert('Erro ao adicionar data');
    }
  };

  const handleRemoveDate = async (date) => {
    try {
      const dateToDelete = customDates.find(d => d.date === date);
      if (dateToDelete) {
        await customDatesService.deleteCustomDate(dateToDelete.id);
        await loadCustomDates();
        alert('Data removida com sucesso! 🗑️');
      }
    } catch (err) {
      console.error('Erro ao remover data:', err);
      alert('Erro ao remover data');
    }
  };

  const loadCustomDates = async () => {
    try {
      const dates = await customDatesService.getCustomDates();
      setCustomDates(dates);
    } catch (err) {
      console.error('Erro ao carregar datas:', err);
    }
  };

  const claimDaily = async () => {
    try {
      const res = await api.post('/users/me/streak');
      // Atualizar o usuário com a nova sequência
      if (user) {
        user.streak = res.data.streak || 0;
        // Award small XP for daily check-in
        const xpRes = await api.post('/users/me/xp', { amount: 10 });
        user.xp = xpRes.data.xp || user.xp + 10;
        user.level = xpRes.data.level || user.level;
      }
      alert('Check-in diário concluído! +10 XP 🎉');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Falha no check-in diário');
    }
  };

  const loadUserData = async () => {
    try {
      // Carregar listas de desejos do usuário
      const wishlistsRes = await api.get('/wishlists/user');
      setWishlists(wishlistsRes.data || []);
    } catch (err) {
      console.log('Usando dados de exemplo para wishlists');
      // Dados mock enquanto as APIs não estão disponíveis
      setWishlists([
        {
          id: 1,
          title: 'Aniversário 2024',
          description: 'Lista especial para meu aniversário',
          items: [
            { id: 1, name: 'Livro de React', price: 89.90, reserved: true },
            { id: 2, name: 'Fones de Ouvido', price: 299.90, reserved: false },
            { id: 3, name: 'Cafeteira', price: 199.90, reserved: true }
          ],
          likes: 12,
          views: 45,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Presentes de Natal',
          description: 'Lista de Natal com coisas que eu amo',
          items: [
            { id: 4, name: 'Console de Videogame', price: 2500.00, reserved: false },
            { id: 5, name: 'Jogo de Tabuleiro', price: 79.90, reserved: true }
          ],
          likes: 8,
          views: 32,
          createdAt: '2024-11-20'
        }
      ]);
      
      // Dados mock para presentes
      setReservedGifts([
        { id: 1, name: 'Livro de React', price: 89.90, category: 'Tecnologia', reservedBy: 'João', createdAt: '2024-01-20' }
      ]);
      
      setReceivedGifts([
        { id: 2, name: 'Fones de Ouvido', price: 299.90, category: 'Eletrônicos', createdAt: '2024-02-10' }
      ]);
      
      setGivenGifts([
        { id: 3, name: 'Cafeteira', price: 199.90, category: 'Cozinha', createdAt: '2024-01-25' }
      ]);
    }
  };

  useEffect(() => {
    loadCustomDates();
    loadUserData();
  }, []);

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'wishlists', name: 'Listas de Desejos', icon: <GiftIcon className="w-5 h-5" /> },
    { id: 'gifts', name: 'Presentes', icon: <HeartIcon className="w-5 h-5" /> },
    { id: 'calendar', name: 'Calendário', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { id: 'settings', name: 'Configurações', icon: <Cog6ToothIcon className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header com animação */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ProfileHeader user={user} onClaimDaily={claimDaily} />
      </motion.div>

      {/* Navegação por abas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Conteúdo das abas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Estatísticas */}
              <ProfileStats 
                user={user} 
                wishlists={wishlists}
                reservedGifts={reservedGifts}
                receivedGifts={receivedGifts}
                givenGifts={givenGifts}
                customDates={customDates}
              />

              {/* Visão geral em grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Dispositivo com miniaturas */}
                <DeviceMockup deviceType="mobile" title="Suas Listas">
                  <div className="p-4 space-y-3">
                    {wishlists.slice(0, 3).map((wishlist, index) => (
                      <motion.div
                        key={wishlist.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{wishlist.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{wishlist.items?.length || 0} itens</p>
                          </div>
                      </motion.div>
                    ))}
                  </div>
                </DeviceMockup>

                {/* Calendário resumido */}
                <DeviceMockup deviceType="desktop" title="Próximas Datas">
                  <div className="p-4">
                    <div className="space-y-3">
                      {customDates.slice(0, 4).map((date, index) => (
                        <motion.div
                          key={date.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                            {new Date(date.date).getDate()}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 dark:text-gray-100">{date.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(date.date).toLocaleDateString('pt-BR', { month: 'short' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </DeviceMockup>
              </div>
            </motion.div>
          )}

          {activeTab === 'wishlists' && (
            <motion.div
              key="wishlists"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Suas Listas de Desejos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlists.map((wishlist, index) => (
                  <WishlistProfileCard key={wishlist.id} wishlist={wishlist} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'gifts' && (
            <motion.div
              key="gifts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Atividade de Presentes</h2>
              
              {/* Presentes Reservados */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <GiftIcon className="w-5 h-5 text-purple-500" />
                Presentes Reservados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {reservedGifts.map((gift, index) => (
                  <GiftActivityCard key={gift.id} gift={gift} type="reserved" index={index} />
                ))}
              </div>

              {/* Presentes Recebidos */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                Presentes Recebidos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {receivedGifts.map((gift, index) => (
                  <GiftActivityCard key={gift.id} gift={gift} type="received" index={index} />
                ))}
              </div>

              {/* Presentes Dados */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-pink-500" />
                Presentes Dados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {givenGifts.map((gift, index) => (
                  <GiftActivityCard key={gift.id} gift={gift} type="given" index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
                <CalendarDaysIcon className="w-6 h-6 text-purple-500" />
                Calendário de Datas Especiais
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <CalendarPicker
                  userDates={customDates}
                  onDateSelect={(date) => console.log('Data selecionada:', date)}
                  onAddDate={handleAddDate}
                  onRemoveDate={handleRemoveDate}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
                <Cog6ToothIcon className="w-6 h-6 text-purple-500" />
                Configurações do Perfil
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <form onSubmit={save} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto do Perfil</label>
                      <UploadButton onUploaded={setAvatarUrl} />
                      {avatarSrc && (
                        <img src={avatarSrc} alt="Foto" className="mt-4 h-20 w-20 rounded-full object-cover shadow-lg" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileModern;